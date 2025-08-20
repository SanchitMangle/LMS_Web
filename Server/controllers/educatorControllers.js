import { clerkClient,  } from '@clerk/express'
import { v2 as cloudinary } from 'cloudinary'
import Course from '../models/course.js';
import Purchase from '../models/purchase.js';
import User from '../models/User.js'


// Update rple to educator
export const updateRoleToEducator = async (req, res) => {

    try {
        const userId = req.auth.userId;

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator'
            }
        })

        res.json({ success: true, message: 'You Can Publish a Course Now' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// Add a new course

export const addCourse = async (req, res) => {

    try {

        const { courseData } = req.body
        const imageFile = req.file
        const educatorId = req.auth.userId;

        if (!imageFile) {
            res.json({ success: false, message: "No Thumbnail File Attached" })
        }

        const parsedCourseData = JSON.parse(courseData)
        parsedCourseData.educator = educatorId

        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        res.json({ success: true, message: 'Course Added' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }

}

// Get educator courses

export const getEducatorCourses = async (req, res) => {

    try {

        const educator = req.auth.userId;
        const courses = await Course.find({ educator })
        res.json({ success: true, courses })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// Get educators dashboard data (total earning,students enrolled,no.of courses)

export const educatorDashboardData = async (req, res) => {
    try {

        const educator = req.auth.userId;
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
        const enrolledStudentsData = []
        for (const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                })
            })
        }

        res.json({
            success: true, dashboardData: {
                totalearnings, enrolledStudentsData, totalCourses
            }
        })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Get enrolled students data with puchase data

export const getenrolledStudentData = async (req, res) => {

    try {

        const educator = req.auth.userId;
        const courses = await Course.find({ educator })
        const courseIds = courses.map(course => course._id)

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }))

        res.json({ success: true, enrolledStudents })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}