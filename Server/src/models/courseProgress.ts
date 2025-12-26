import mongoose, { Document } from 'mongoose'

export interface ICourseProgress extends Document {
    userId: string;
    courseId: string;
    completed: boolean;
    lectureCompleted: { lectureId: string; completed: boolean }[];
    certificateId?: string;
    dateCompleted?: Date;
}

const courseProgressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    lectureCompleted: [],
    certificateId: { type: String },
    dateCompleted: { type: Date }
}, { minimize: false })

const CourseProgress = mongoose.model<ICourseProgress>('CourseProgress', courseProgressSchema)

export default CourseProgress