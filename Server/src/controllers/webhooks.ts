import { Webhook } from "svix";
import User from '../models/User.js'
import Stripe from "stripe";
import Purchase from "../models/purchase.js";
import Course from "../models/course.js";
import { Request, Response } from "express";

// API controller function to manage clerk user with database

export const clerkWebhooks = async (req: Request, res: Response): Promise<void> => {

    try {

        const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRETE as string)

        await webhook.verify(JSON.stringify(req.body), {
            'svix-id': req.headers['svix-id'] as string,
            'svix-signature': req.headers['svix-signature'] as string,
            'svix-timestamp': req.headers['svix-timestamp'] as string
        })

        const { data, type } = req.body

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url
                }

                await User.create(userData)
                res.json({})
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url
                }

                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break;
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }

            default:
                break;
        }

    } catch (error: any) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}


const stripeInstance = new Stripe(process.env.STRIPE_SECRETE_KEY as string)

export const stripeWebhooks = async (request: Request, response: Response): Promise<any> => {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    let event;
    try {
        event = Stripe.webhooks.constructEvent(
            request.body,
            signature as string,
            process.env.STRIPE_WEBHOOK_SECRETE as string
        );
    } catch (err: any) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object;
            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            const paymentId = paymentIntent.id

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentId
            })

            const { purchaseId } = session.data[0].metadata as any
            const purchaseData = await Purchase.findById(purchaseId)
            
            if(!purchaseData) break;

            const userData = await User.findById(purchaseData.userId)
            const courseData = await Course.findById(purchaseData.courseId.toString()) // toHexString or toString if ObjectId

            if(!userData || !courseData) break;

            courseData.enrolledStudents.push(userData._id as any) // Assuming we push ID string as per model ref: 'User'. But User model _id is String.
            await courseData.save()

            userData.enrolledCourses.push(courseData._id as any)
            await userData.save()

            purchaseData.status = 'completed'
            await purchaseData.save()


            break;
        }
        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            const paymentId = paymentIntent.id

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentId
            })

            const { purchaseId } = session.data[0].metadata as any
            const purchaseData = await Purchase.findById(purchaseId)
            
            if(purchaseData){
                purchaseData.status = 'failed'
                await purchaseData.save()
            }

            break;
        }
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });

}