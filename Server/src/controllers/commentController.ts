import { Request, Response } from 'express';
import Comment from '../models/comment.js';
import User from '../models/User.js';

interface ProtectedRequest extends Request {
    auth: {
        userId: string;
    }
}

// Add a comment
export const addComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const authReq = req as ProtectedRequest;
        const userId = authReq.auth.userId;
        const { lectureId, courseId, text } = req.body;

        const newComment = await Comment.create({
            lectureId,
            courseId,
            userId,
            text
        });
        
        // Populate user details for immediate display
        const populatedComment = await Comment.findById(newComment._id).populate('userId', 'name imageUrl');

        res.json({ success: true, comment: populatedComment });

    } catch (error: any) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get comments for a lecture
export const getLectureComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const { lectureId } = req.params;
        
        const comments = await Comment.find({ lectureId })
            .populate('userId', 'name imageUrl')
            .sort({ createdAt: -1 });

        res.json({ success: true, comments });

    } catch (error: any) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
