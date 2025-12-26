import mongoose, { Schema } from "mongoose";
const CommentSchema = new Schema({
    lectureId: { type: String, required: true },
    courseId: { type: String, required: true },
    userId: { type: String, required: true, ref: 'User' },
    text: { type: String, required: true },
}, { timestamps: true });
const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
