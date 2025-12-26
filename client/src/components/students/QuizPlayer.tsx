import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuizQuestion {
    questionText: string
    options: string[]
    correctAnswerIndex: number
}

interface QuizPlayerProps {
    quizData: QuizQuestion[]
    onComplete: () => void
}

const QuizPlayer = ({ quizData, onComplete }: QuizPlayerProps) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [isAnswerChecked, setIsAnswerChecked] = useState(false)
    const [score, setScore] = useState(0)
    const [quizCompleted, setQuizCompleted] = useState(false)

    const currentQuestion = quizData[currentQuestionIndex]

    const handleOptionSelect = (index: number) => {
        if (!isAnswerChecked) {
            setSelectedOption(index)
        }
    }

    const handleCheckAnswer = () => {
        if (selectedOption === null) return

        setIsAnswerChecked(true)
        if (selectedOption === currentQuestion.correctAnswerIndex) {
            setScore(prev => prev + 1)
        }
    }

    const handleNext = () => {
        if (currentQuestionIndex < quizData.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
            setSelectedOption(null)
            setIsAnswerChecked(false)
        } else {
            setQuizCompleted(true)
            onComplete()
        }
    }

    const resetQuiz = () => {
        setCurrentQuestionIndex(0)
        setSelectedOption(null)
        setIsAnswerChecked(false)
        setScore(0)
        setQuizCompleted(false)
    }

    if (quizCompleted) {
        return (
            <div className="flex flex-col items-center justify-center p-8 h-full bg-card rounded-xl border shadow-sm text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
                <p className="text-muted-foreground mb-6 text-lg">You scored {score} out of {quizData.length}</p>

                <div className="flex gap-4">
                    <Button onClick={resetQuiz} variant="outline" className="gap-2">
                        <RotateCcw className="w-4 h-4" /> B Retake Quiz
                    </Button>
                    {/* Could add a 'Continue' button here if passed */}
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center h-full bg-muted/10 p-4">
            <Card className="w-full max-w-2xl shadow-lg border-t-4 border-t-primary">
                <CardHeader className="border-b bg-muted/5">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">Question {currentQuestionIndex + 1} of {quizData.length}</CardTitle>
                        <span className="text-sm font-medium text-muted-foreground bg-background px-3 py-1 rounded-full border">
                            Score: {score}
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <h3 className="text-xl font-medium leading-relaxed">{currentQuestion.questionText}</h3>

                    <div className="grid gap-3">
                        {currentQuestion.options.map((option, index) => {
                            let optionStyle = "hover:bg-accent hover:text-accent-foreground border-2"

                            // Logic for styling based on answer state
                            if (isAnswerChecked) {
                                if (index === currentQuestion.correctAnswerIndex) {
                                    optionStyle = "bg-green-100 border-green-500 text-green-900" // Correct Answer
                                } else if (index === selectedOption) {
                                    optionStyle = "bg-red-100 border-red-500 text-red-900" // Wrong Selection
                                } else {
                                    optionStyle = "opacity-50 border-transparent"
                                }
                            } else if (selectedOption === index) {
                                optionStyle = "border-primary bg-primary/5 ring-1 ring-primary" // Selected state
                            } else {
                                optionStyle = "border-transparent bg-muted/30" // Default
                            }

                            return (
                                <button
                                    key={index}
                                    disabled={isAnswerChecked}
                                    onClick={() => handleOptionSelect(index)}
                                    className={cn(
                                        "w-full text-left p-4 rounded-lg transition-all duration-200 flex items-center justify-between group",
                                        optionStyle
                                    )}
                                >
                                    <span className="font-medium text-base">{option}</span>
                                    {isAnswerChecked && index === currentQuestion.correctAnswerIndex && (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    )}
                                    {isAnswerChecked && index === selectedOption && index !== currentQuestion.correctAnswerIndex && (
                                        <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t bg-muted/5 p-6">
                    {!isAnswerChecked ? (
                        <Button onClick={handleCheckAnswer} disabled={selectedOption === null} size="lg" className="w-full sm:w-auto px-8">
                            Check Answer
                        </Button>
                    ) : (
                        <Button onClick={handleNext} size="lg" className="w-full sm:w-auto px-8 gap-2">
                            {currentQuestionIndex < quizData.length - 1 ? 'Next Question' : 'View Results'} <ArrowRight className="w-4 h-4" />
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}

export default QuizPlayer
