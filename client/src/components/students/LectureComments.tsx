import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'

// Since I don't have a Textarea component, I'll use standard or create one. 
// Standard textarea with Tailwind is fine.

interface Comment {
    _id: string;
    text: string;
    userId: {
        _id: string;
        name: string;
        imageUrl: string;
    };
    createdAt: string;
}

interface LectureCommentsProps {
    lectureId: string;
    courseId: string;
}

const LectureComments = ({ lectureId, courseId }: LectureCommentsProps) => {

    const { backendUrl, userData, getToken } = useContext(AppContext)!
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(false)

    const fetchComments = async () => {
        try {
            const { data } = await axios.get(backendUrl + `/api/course/${lectureId}/comments`)
            if (data.success) {
                setComments(data.comments)
            } else {
                // Silently fail or log?
                console.error(data.message)
            }
        } catch (error: any) {
            console.log(error)
        }
    }

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            setLoading(true)
            const token = await getToken()
            const { data } = await axios.post(
                backendUrl + '/api/user/add-comment',
                { lectureId, courseId, text: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (data.success) {
                setComments(prev => [data.comment, ...prev])
                setNewComment('')
                toast.success('Comment added!')
            } else {
                toast.error(data.message)
            }

        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchComments()
    }, [lectureId]) // Refetch when lecture changes

    return (
        <div className="space-y-6 mt-10">
            <h3 className="text-xl font-bold text-gray-800">Discussion ({comments.length})</h3>

            {/* Add Comment */}
            <div className="flex gap-4">
                <img src={userData?.imageUrl || "https://via.placeholder.com/40"} alt="User" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 space-y-2">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Ask a question or share your thoughts..."
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        rows={3}
                    />
                    <div className="flex justify-end">
                        <Button onClick={handleAddComment} disabled={loading || !newComment.trim()}>
                            {loading ? 'Posting...' : 'Post Comment'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-4 p-4 bg-gray-50/50 rounded-lg">
                        <img src={comment.userId.imageUrl} alt={comment.userId.name} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900">{comment.userId.name}</span>
                                <span className="text-xs text-gray-500">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">{comment.text}</p>
                        </div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <p className="text-center text-gray-500 text-sm py-8">No comments yet. Be the first to start the discussion!</p>
                )}
            </div>
        </div>
    )
}

export default LectureComments
