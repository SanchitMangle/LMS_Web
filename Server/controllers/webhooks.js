import { Webhook } from "svix";
import User from '../models/User.js'
import Stripe from "stripe";
import Purchase from "../models/purchase.js";
import Course from "../models/course.js";

// API controller function to manage clerk user with database

export const clerkWebhooks = async (req, res) => {

    try {

        const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRETE)

        await webhook.verify(JSON.stringify(req.body), {
            'svix-id': req.headers['svix-id'],
            'svix-signature': req.headers['svix-signature'],
            'svix-timestamp': req.headers['svix-timestamp']
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

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}


const stripeInstance = new Stripe(process.env.STRIPE_SECRETE_KEY)
export const stripeWebhooks = async (request, response) => {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    let event;
    try {
        event = Stripe.webhooks.constructEvent(
            request.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRETE
        );
    } catch (err) {
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

            const { purchaseId } = session.data[0].metadata
            const purchaseData = await Purchase.findById(purchaseId)
            const userData = await User.findById(purchaseData.userId)
            const courseData = await Course.findById(purchaseData.courseId.toHexString())

            courseData.enrolledStudents.push(userData)
            await courseData.save()

            userData.enrolledCourses.push(courseData._id)
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

            const { purchaseId } = session.data[0].metadata
            const purchaseData = await Purchase.findById(purchaseId)
            purchaseData.status = 'failed'
            await purchaseData.save()

            break;
        }
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });

}