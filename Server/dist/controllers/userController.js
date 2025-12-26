import User from "../models/User.js";
import Course from '../models/course.js';
import CourseProgress from "../models/courseProgress.js";
import Purchase from "../models/purchase.js";
import Stripe from 'stripe';
// get user data
export const getUserData = async (req, res) => {
    try {
        const authReq = req;
        const userId = authReq.auth.userId;
        const user = await User.findById(userId);
        if (!user) {
            res.json({ success: false, message: 'User Not Found' });
            return;
        }
        res.json({ success: true, user });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
// User enrolled courses with lectures link
export const userEnrolledCourses = async (req, res) => {
    try {
        const authReq = req;
        const userId = authReq.auth.userId;
        const userData = await User.findById(userId).populate('enrolledCourses');
        if (!userData) {
            res.json({ success: false, message: 'User Not Found' });
            return;
        }
        res.json({ success: true, enrolledCourses: userData.enrolledCourses });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
// TO Purcahasea course
export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const { origin } = req.headers;
        const authReq = req;
        const userId = authReq.auth.userId;
        const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);
        if (!userData || !courseData) {
            res.json({ success: false, message: 'Data Not Found' });
            return;
        }
        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),
        };
        const newPurchase = await Purchase.create(purchaseData);
        // Stripe gatway Initillization
        const stripeInstance = new Stripe(process.env.STRIPE_SECRETE_KEY);
        const currency = process.env.CURRENCY ? process.env.CURRENCY.toLowerCase() : 'usd';
        // creating line items for stripe
        const line_items = [{
                price_data: {
                    currency,
                    product_data: {
                        name: courseData.courseTitle
                    },
                    unit_amount: Math.floor(newPurchase.amount * 100)
                },
                quantity: 1
            }];
        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        });
        res.json({ success: true, session_url: session.url });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
//Update Course Progress
export const updateUserCouresProgress = async (req, res) => {
    try {
        const authReq = req;
        const userId = authReq.auth.userId;
        const { courseId, lectureId } = req.body;
        const progressData = await CourseProgress.findOne({ userId, courseId });
        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                res.json({ success: true, message: 'Lecture Already Completed' });
                return;
            }
            progressData.lectureCompleted.push(lectureId);
            // Check for Course Completion
            const course = await Course.findById(courseId);
            if (course) {
                let totalLectures = 0;
                course.courseContent.forEach(ch => totalLectures += ch.chapterContent.length);
                const completedLectures = progressData.lectureCompleted.length;
                if (completedLectures >= totalLectures && !progressData.completed) {
                    progressData.completed = true;
                    progressData.dateCompleted = new Date();
                    progressData.certificateId = Math.random().toString(36).substring(2, 11).toUpperCase() + Date.now().toString(36).toUpperCase(); // Simple ID generation
                }
            }
            await progressData.save();
        }
        else {
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            });
        }
        res.json({ success: true, message: 'Progress Updated' });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
// Get user course progress 
export const getUserCourseProgress = async (req, res) => {
    try {
        const authReq = req;
        const userId = authReq.auth.userId;
        const { courseId } = req.body;
        const progressData = await CourseProgress.findOne({ userId, courseId });
        res.json({ success: true, progressData });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
// Add user Rating to course 
export const addUserRating = async (req, res) => {
    const authReq = req;
    const userId = authReq.auth.userId;
    const { courseId, rating } = req.body;
    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        return res.json({ success: false, message: 'Invalid Details' });
    }
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.json({ success: false, message: 'Course Not Found' });
        }
        const user = await User.findById(userId);
        if (!user || !user.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: 'User has not purchased this course' });
        }
        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId);
        if (existingRatingIndex > -1) {
            course.courseRatings[existingRatingIndex].rating = rating;
        }
        else {
            course.courseRatings.push({ userId, rating });
        }
        await course.save();
        return res.json({ success: true, message: "Rating Added" });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
