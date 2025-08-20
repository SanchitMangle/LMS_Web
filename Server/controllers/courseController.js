import Course from "../models/course.js";

// get all courses 

export const gwtAllCourses = async (req, res) => {
    try {

        const courses = await Course.find({ isPublished: true }).select([
            '-courseContent', '-enrolledStudents']).populate({ path: 'educator' })

        res.json({ success: true, courses })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Get course by ID

export const getCourseById = async (req, res) => {

    const { id } = req.params

    try {

        const courseData = await Course.findById(id).populate({ path: 'educator' })

        //  remove lecture if isPreviewFree is false 
        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = ''
                }
            })
        })

        res.json({ success: true, courseData })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}  

