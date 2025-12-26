import express from 'express'
import { getCourseById, getAllCourses } from '../controllers/courseController.js'
import { getLectureComments } from '../controllers/commentController.js'

const courseRouter = express.Router()

courseRouter.get('/all', getAllCourses)
courseRouter.get('/:id', getCourseById)
courseRouter.get('/:lectureId/comments', getLectureComments)

export default courseRouter