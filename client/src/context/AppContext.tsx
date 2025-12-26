import { createContext, useEffect, useState, ReactNode } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import humanizeDuration from 'humanize-duration'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from "react-toastify";

export interface QuizQuestion {
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
}

export interface Lecture {
    lectureId: string;
    lectureTitle: string;
    lectureDuration: number;
    lectureUrl: string;
    isPreviewFree: boolean;
    lectureOrder: number;
    lectureType: 'video' | 'quiz';
    quizQuestions?: QuizQuestion[];
}

export interface Chapter {
    chapterId: string;
    chapterTitle: string;
    chapterContent: Lecture[];
    collapsed?: boolean;
    chapterOrder: number;
}

export interface Course {
    _id: string;
    courseTitle: string;
    coursePrice: number;
    isPublished: boolean;
    discount: number;
    courseCategory: string;
    courseDescription: string;
    courseContent: Chapter[];
    courseRatings: any[];
    enrolledStudents: string[];
    courseThumbnail: string;
    educator: {
        _id: string;
        name: string;
        imageUrl: string;
    };
}

export interface AppContextType {
    currency: string;
    allCourses: Course[];
    navigate: NavigateFunction;
    calculateRating: (course: Course) => number;
    isEducator: boolean;
    setIsEducator: React.Dispatch<React.SetStateAction<boolean>>;
    calculateCourseChapterTime: (chapter: any) => string;
    calculateCourseDuration: (course: Course) => string;
    calculateNoOfLectures: (course: Course) => number;
    setEnrolledCourses: React.Dispatch<React.SetStateAction<any[]>>;
    enrolledCourses: any[];
    fetchUserEnrolledCourses: () => Promise<void>;
    backendUrl: string;
    userData: any;
    setUserData: React.Dispatch<React.SetStateAction<any>>;
    getToken: () => Promise<string | null>;
    fetchAllCourses: () => Promise<void>;
}

export const AppContext = createContext<AppContextType | null>(null);

interface AppContextProviderProps {
    children: ReactNode;
}

export const AppContextProvider = (props: AppContextProviderProps) => {

    const { getToken } = useAuth()
    const { user } = useUser()
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY || "$"
    const [allCourses, setAllCourses] = useState<Course[]>([])
    const [isEducator, setIsEducator] = useState(false)
    const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
    const [userData, setUserData] = useState<any>(null)

    // Fetch all courses
    const fetchAllCourses = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/course/all')
            if (data.success) {
                setAllCourses(data.courses)
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error.message)
        }
    }

    // Fetch user data 
    const fetchUserData = async () => {
        if (user?.publicMetadata?.role === 'educator') {
            setIsEducator(true)
        }

        try {
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/user/data', { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                setUserData(data.user)
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error.message)
        }
    }

    // Function to calculate average rating of course
    const calculateRating = (course: Course) => {
        if (course.courseRatings.length === 0) {
            return 0
        }
        let totalRating = 0
        course.courseRatings.forEach((rating: any) => {
            totalRating += rating.rating
        })
        return Math.floor(totalRating / course.courseRatings.length)
    }

    // Function to calculate course chapter timing
    const calculateCourseChapterTime = (chapter: Chapter) => {
        let time = 0
        if (chapter.chapterContent) {
            chapter.chapterContent.map((lecture: Lecture) => time += lecture.lectureDuration)
        }
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
    }

    // Function to calculate course duration
    const calculateCourseDuration = (course: Course) => {
        let time = 0
        course.courseContent.map((chapter) => chapter.chapterContent.map(
            (lecture: Lecture) => time += lecture.lectureDuration))
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
    }

    // function to calculate total lectures in course
    const calculateNoOfLectures = (course: Course) => {
        let totalLectures = 0
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length
            }
        })
        return totalLectures;
    }

    // fetch user enrolled courses
    const fetchUserEnrolledCourses = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) {
                setEnrolledCourses(data.enrolledCourses.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchAllCourses()
    }, [])

    useEffect(() => {
        if (user) {
            fetchUserData()
            fetchUserEnrolledCourses()
        }
    }, [user])

    const value: AppContextType = {
        currency, allCourses, navigate,
        calculateRating, isEducator, setIsEducator,
        calculateCourseChapterTime, calculateCourseDuration,
        calculateNoOfLectures, setEnrolledCourses, enrolledCourses,
        fetchUserEnrolledCourses, backendUrl, userData, setUserData,
        getToken, fetchAllCourses
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}