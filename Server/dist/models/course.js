import mongoose from "mongoose";
const quizQuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswerIndex: { type: Number, required: true }
}, { _id: false });
const lectureSchema = new mongoose.Schema({
    lectureId: { type: String, required: true },
    lectureTitle: { type: String, required: true },
    lectureDuration: { type: Number, required: true },
    lectureUrl: { type: String },
    isPreviewFree: { type: Boolean, required: true },
    lectureOrder: { type: Number, required: true },
    lectureType: { type: String, enum: ['video', 'quiz'], default: 'video', required: true },
    quizQuestions: [quizQuestionSchema]
}, { _id: false });
const chapterSchema = new mongoose.Schema({
    chapterId: { type: String, required: true },
    chapterOrder: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    chapterContent: [lectureSchema]
}, { _id: false });
const courseSchema = new mongoose.Schema({
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: true },
    courseThumbnail: { type: String, },
    coursePrice: { type: Number, required: true },
    isPublished: { type: Boolean, default: true },
    discount: { type: Number, required: true, min: 0, max: 100 },
    courseCategory: { type: String, required: true }, // New schema field
    courseContent: [chapterSchema],
    courseRatings: [
        {
            userId: { type: String },
            rating: { type: Number, min: 1, max: 5 }
        }
    ],
    educator: { type: String, ref: 'User', required: true },
    enrolledStudents: [
        { type: String, ref: 'User' }
    ],
}, { timestamps: true, minimize: false });
const Course = mongoose.model('Course', courseSchema);
export default Course;
