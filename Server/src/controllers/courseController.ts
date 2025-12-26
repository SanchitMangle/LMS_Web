import Course from "../models/course.js";
import { Request, Response } from 'express';

// get all courses 

export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
    try {

        const courses = await Course.find({ isPublished: true }).select([
            '-courseContent', '-enrolledStudents']).populate({ path: 'educator' })

        res.json({ success: true, courses })

    } catch (error: any) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Get course by ID

export const getCourseById = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.params

    try {

        const courseData = await Course.findById(id).populate({ path: 'educator' })

        if (!courseData) {
            res.json({ success: false, message: 'Course not found' })
            return;
        }

        //  remove lecture if isPreviewFree is false 
        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = ''
                }
            })
        })

        res.json({ success: true, courseData })

    } catch (error: any) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}  

