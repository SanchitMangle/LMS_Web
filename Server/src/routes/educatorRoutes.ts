import express from 'express'
import { addCourse, educatorDashboardData, getEducatorCourses, getenrolledStudentData, updateRoleToEducator } from '../controllers/educatorControllers.js'
import upload from '../config/multer.js'
import { protectEducator } from '../middleware/authMiddleware.js'

const educatorRouter = express.Router()

// Add educator role
educatorRouter.get('/update-role', updateRoleToEducator)

// Add a course
educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse)

// Get all courses
educatorRouter.get('/courses', protectEducator, getEducatorCourses)

// Get data
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData)
educatorRouter.get('/enrolled-students', protectEducator, getenrolledStudentData)


export default educatorRouter;