import User from "../models/User.js";
import Course from '../models/course.js'
import Purchase from "../models/purchase.js";
import Stripe from 'stripe'

// get user data
export const getUserData = async (req, res) => {

    try {

        const userId = req.auth.userId
        const user = await User.findById(userId)

        if (!user) {
            res.json({ success: false, message: 'User Not Found' })
        }

        res.json({ success: true, user })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// User enrolled courses with lectures link

export const userEnrolledCourses = async (req, res) => {

    try {

        const userId = req.auth.userId
        const userData = await User.findById(userId).populate('enrolledCourses')
        res.json({ success: true, enrolledCourses: userData.enrolledCourses })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// TO Purcahasea course

export const purchaseCourse = async (req, res) => {

    try {

        const { courseId } = req.body
        const { origin } = req.headers
        const userId = req.auth.userId
        const userData = await User.findById(userId)
        const courseData = await Course.findById(courseId)

        if (!userData || !courseData) {
            res.json({ success: false, message: 'Data Not Found' })
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),
        }

        const newPurchase = await Purchase.create(purchaseData)

        // Stripe gatway Initillization
        const stripeInstance = new Stripe(process.env.STRIPE_SECRETE_KEY)
        const currency = process.env.CURRENCY.toLocaleLowerCase()

        // creating line items for stripe
        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toHexString()
            }
        })

        res.json({ success: true, session_url: session.url })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}