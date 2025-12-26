import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    imageUrl: string;
    enrolledCourses: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    imageUrl: { type: String, required: true },
    enrolledCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ]
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User