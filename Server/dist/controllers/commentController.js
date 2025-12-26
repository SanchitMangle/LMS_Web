import Comment from '../models/comment.js';
// Add a comment
export const addComment = async (req, res) => {
    try {
        const authReq = req;
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
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
// Get comments for a lecture
export const getLectureComments = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const comments = await Comment.find({ lectureId })
            .populate('userId', 'name imageUrl')
            .sort({ createdAt: -1 });
        res.json({ success: true, comments });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
