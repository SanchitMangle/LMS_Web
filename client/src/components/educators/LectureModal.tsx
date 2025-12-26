import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

// Reuse interfaces (should be in a types file, but defining here for now)
interface QuizQuestion {
    questionText: string
    options: string[]
    correctAnswerIndex: number
}

interface LectureDetail {
    lectureTitle: string
    lectureDuration: string
    lectureUrl: string
    isPreviewFree: boolean
    lectureType: 'video' | 'quiz'
    quizQuestions: QuizQuestion[]
}

interface LectureModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (lecture: LectureDetail) => void
}

const LectureModal = ({ isOpen, onClose, onAdd }: LectureModalProps) => {
    const [lectureDetail, setLectureDetail] = useState<LectureDetail>({
        lectureTitle: '',
        lectureDuration: '',
        lectureUrl: '',
        isPreviewFree: false,
        lectureType: 'video',
        quizQuestions: []
    })

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setLectureDetail({
                lectureTitle: '',
                lectureDuration: '',
                lectureUrl: '',
                isPreviewFree: false,
                lectureType: 'video',
                quizQuestions: []
            })
        }
    }, [isOpen])

    const handleSubmit = () => {
        if (!lectureDetail.lectureTitle) return; // Simple validation
        onAdd(lectureDetail)
        onClose()
    }

    // Quiz Helpers
    const addQuestion = () => {
        setLectureDetail({
            ...lectureDetail,
            quizQuestions: [...lectureDetail.quizQuestions, { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]
        })
    }

    const removeQuestion = (index: number) => {
        const updatedQuestions = [...lectureDetail.quizQuestions];
        updatedQuestions.splice(index, 1);
        setLectureDetail({ ...lectureDetail, quizQuestions: updatedQuestions });
    }

    const updateQuestion = (index: number, field: keyof QuizQuestion, value: any, optionIndex?: number) => {
        const updatedQuestions = [...lectureDetail.quizQuestions];
        if (field === 'options' && typeof optionIndex === 'number') {
            updatedQuestions[index].options[optionIndex] = value;
        } else if (field !== 'options') {
            (updatedQuestions[index] as any)[field] = value;
        }
        setLectureDetail({ ...lectureDetail, quizQuestions: updatedQuestions });
    }

    if (!isOpen) return null

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto'>
            <Card className='w-full max-w-2xl animate-in fade-in zoom-in duration-200 shadow-2xl'>
                <CardHeader className="relative border-b pb-4">
                    <CardTitle>Add New Lecture</CardTitle>
                    <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4 pt-6 max-h-[80vh] overflow-y-auto">

                    {/* Lecture Type Toggle */}
                    <div className="flex items-center gap-4 bg-muted/20 p-2 rounded-lg border">
                        <Label className="shrink-0 font-medium pl-2">Lecture Type:</Label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={lectureDetail.lectureType === 'video' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setLectureDetail({ ...lectureDetail, lectureType: 'video' })}
                            >Video</Button>
                            <Button
                                type="button"
                                variant={lectureDetail.lectureType === 'quiz' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setLectureDetail({ ...lectureDetail, lectureType: 'quiz' })}
                            >Quiz</Button>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label>Lecture Title</Label>
                        <Input
                            type="text"
                            value={lectureDetail.lectureTitle}
                            onChange={(e) => setLectureDetail({ ...lectureDetail, lectureTitle: e.target.value })}
                            placeholder={lectureDetail.lectureType === 'video' ? "e.g. Introduction to React" : "e.g. React Basics Quiz"}
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label>Duration (minutes)</Label>
                        <Input
                            type="number"
                            value={lectureDetail.lectureDuration}
                            onChange={(e) => setLectureDetail({ ...lectureDetail, lectureDuration: e.target.value })}
                            placeholder="e.g. 15"
                        />
                    </div>

                    {lectureDetail.lectureType === 'video' ? (
                        <div className='space-y-2'>
                            <Label>Video URL</Label>
                            <Input
                                type="text"
                                value={lectureDetail.lectureUrl}
                                onChange={(e) => setLectureDetail({ ...lectureDetail, lectureUrl: e.target.value })}
                                placeholder="e.g. https://youtube.com/..."
                            />
                        </div>
                    ) : (
                        <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                            <div className="flex justify-between items-center">
                                <Label>Quiz Questions</Label>
                                <Button type="button" size="sm" variant="outline" onClick={addQuestion}>+ Add Question</Button>
                            </div>

                            {lectureDetail.quizQuestions.map((q, qIndex) => (
                                <div key={qIndex} className="space-y-3 p-3 border rounded bg-background">
                                    <div className="flex justify-between items-start gap-2">
                                        <Input
                                            placeholder={`Question ${qIndex + 1}`}
                                            value={q.questionText}
                                            onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeQuestion(qIndex)} className="text-red-500"><X className="w-4 h-4" /></Button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                                        {q.options.map((option, oIndex) => (
                                            <div key={oIndex} className="flex gap-2 items-center">
                                                <input
                                                    type="radio"
                                                    name={`correct-${qIndex}`}
                                                    checked={q.correctAnswerIndex === oIndex}
                                                    onChange={() => updateQuestion(qIndex, 'correctAnswerIndex', oIndex)}
                                                />
                                                <Input
                                                    placeholder={`Option ${oIndex + 1}`}
                                                    value={option}
                                                    onChange={(e) => updateQuestion(qIndex, 'options', e.target.value, oIndex)}
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className='flex items-center gap-2 pt-2'>
                        <input
                            type="checkbox"
                            id="isPreviewFree"
                            className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                            checked={lectureDetail.isPreviewFree}
                            onChange={(e) => setLectureDetail({ ...lectureDetail, isPreviewFree: e.target.checked })}
                        />
                        <Label htmlFor="isPreviewFree" className="cursor-pointer font-normal">Make this lecture free for preview</Label>
                    </div>

                    <Button onClick={handleSubmit} type='button' className='w-full mt-4'>Add Lecture</Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default LectureModal
