import { clerkClient } from '@clerk/express'
import { v2 as cloudinary } from 'cloudinary'
import Course from '../models/course.js';
import Purchase from '../models/purchase.js';
import User from '../models/User.js';
import { Request, Response } from 'express';

interface ProtectedRequest extends Request {
    auth: {
        userId: string;
    }
}

// Update role to educator
export const updateRoleToEducator = async (req: Request, res: Response): Promise<void> => {

    try {
        const authReq = req as ProtectedRequest;
        const userId = authReq.auth.userId;

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator'
            }
        })

        res.json({ success: true, message: 'You Can Publish a Course Now' })

    } catch (error: any) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// Add a new course

// Add a new course

export const addCourse = async (req: Request, res: Response): Promise<void> => {

    try {

        const { courseData } = req.body
        const imageFile = req.file
        const authReq = req as ProtectedRequest;
        const educatorId = authReq.auth.userId;

        if (!imageFile) {
            res.json({ success: false, message: "No Thumbnail File Attached" })
            return;
        }

        const parsedCourseData = JSON.parse(courseData)
        parsedCourseData.educator = educatorId

        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        res.json({ success: true, message: 'Course Added' })

    } catch (error: any) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }

}

// Get educator courses

export const getEducatorCourses = async (req: Request, res: Response): Promise<void> => {

    try {
        const authReq = req as ProtectedRequest;
        const educator = authReq.auth.userId;
        const courses = await Course.find({ educator })
        res.json({ success: true, courses })

    } catch (error: any) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// Get educators dashboard data (total earning,students enrolled,no.of courses)

export const educatorDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {
        const authReq = req as ProtectedRequest;
        const educator = authReq.auth.userId;
        const courses = await Course.find({ educator })
        const totalCourses = courses.length

        const courseIds = courses.map(course => course._id)

        // Calculate total earnings from purchases
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        })

        const totalearnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)

        // Collect unique enrolled ids with there course title 
        const enrolledStudentsData: any[] = []
        const latestPurchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).sort({ createdAt: -1 }).limit(5).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

        latestPurchases.forEach((purchase: any) => {
            enrolledStudentsData.push({
                courseTitle: purchase.courseId.courseTitle,
                student: purchase.userId
            })
        })

        // Calculate earnings over time (grouped by date)
        const earningsByDate = purchases.reduce((acc: any, purchase) => {
            const date = new Date(purchase.createdAt).toLocaleDateString('en-US');
            acc[date] = (acc[date] || 0) + purchase.amount;
            return acc;
        }, {});

        // Generate Last 7 Days Data
        const chartData = [];
        for (let i = 0; i <= 6; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateString = d.toLocaleDateString('en-US');
            chartData.unshift({
                day: dateString,
                amount: earningsByDate[dateString] || 0
            });
        }

        res.json({
            success: true, dashboardData: {
                totalearnings, enrolledStudentsData, totalCourses, chartData
            }
        })

    } catch (error: any) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Get enrolled students data with puchase data

export const getenrolledStudentData = async (req: Request, res: Response): Promise<void> => {

    try {
        const authReq = req as ProtectedRequest;
        const educator = authReq.auth.userId;
        const courses = await Course.find({ educator })
        const courseIds = courses.map(course => course._id)

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

        const enrolledStudents = purchases.map((purchase: any) => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }))

        res.json({ success: true, enrolledStudents })

    } catch (error: any) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}