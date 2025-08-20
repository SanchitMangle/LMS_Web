import express from 'express'
import { getCourseById ,gwtAllCourses} from '../controllers/courseController.js'

const courseRouter = express.Router()

courseRouter.get('/all',gwtAllCourses)
courseRouter.get('/:id',getCourseById)

export default courseRouter