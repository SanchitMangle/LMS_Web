import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
    lectureId: string;
    courseId: string;
    userId: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        _id: string;
        name: string;
        imageUrl: string;
    }
}

const CommentSchema = new Schema({
    lectureId: { type: String, required: true },
    courseId: { type: String, required: true },
    userId: { type: String, required: true, ref: 'User' },
    text: { type: String, required: true },
}, { timestamps: true });

const Comment = mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;
