import { useEffect, useState, useContext } from 'react'
import { AppContext, Course } from '../../context/AppContext'
import humanizeDuration from 'humanize-duration'
import { assets } from '../../assets/assets'
import { useParams } from 'react-router-dom'
import YouTube from 'react-youtube'
import Footer from '../../components/students/Footer'
import Rating from '../../components/students/Rating'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../../components/students/Loading'
import { Button } from '@/components/ui/button'
import { CheckCircle, PlayCircle, Menu, ChevronLeft, ChevronRight, Award, Clock, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from "@/components/ui/progress"
import QuizPlayer from '@/components/students/QuizPlayer'
import { jsPDF } from "jspdf"
import LectureComments from '@/components/students/LectureComments'
import { motion, AnimatePresence } from 'framer-motion'

const Player = () => {

  const { enrolledCourses, fetchUserEnrolledCourses, backendUrl, userData, getToken, calculateNoOfLectures } = useContext(AppContext)!
  const { courseId } = useParams()

  const [courseData, setCourseData] = useState<Course | null>(null)
  const [openSections, setOptionSections] = useState<{ [key: number]: boolean }>({})
  const [playerData, setPlayerData] = useState<any>(null)
  const [progressData, setProgressData] = useState<any>(null)
  const [initialRating, setInitialRating] = useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('Overview')
  const [note, setNote] = useState<string>('')

  const getCourseData = () => {
    enrolledCourses.forEach((course) => {
      if (course._id === courseId) {
        setCourseData(course)
        course.courseRatings.forEach((item: any) => {
          if (item.userId === userData?._id) {
            setInitialRating(item.rating)
          }
        })
      }
    })
  }

  const toggleSection = (index: number) => {
    setOptionSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData()
    }
  }, [enrolledCourses])

  const markLectureCompleted = async (lectureId: string) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/user/update-course-progress', { courseId, lectureId }, { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        toast.success(data.message)
        getCourseProgress()
      }
      else {
        toast.error(data.message)
      }

    } catch (error: any) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const getCourseProgress = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/user/get-course-progress', { courseId }, { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        setProgressData(data.progressData)
      }
      else {
        toast.error(data.message)
      }

    } catch (error: any) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const HandleRating = async (rating: number) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/user/add-rating', { courseId, rating }, { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        toast.success(data.message)
        fetchUserEnrolledCourses()
      }
      else {
        toast.error(data.message)
      }

    } catch (error: any) {
      console.log(error);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getCourseProgress()
  }, [])

  useEffect(() => {
    if (courseData && playerData && playerData.lectureId) {
      const savedNote = localStorage.getItem(`notes-${courseData._id}-${playerData.lectureId}`) || ''
      setNote(savedNote)
    }
  }, [courseData, playerData?.lectureId])

  // Calculate Progress Percentage
  const calculateProgress = () => {
    if (!courseData || !progressData) return 0;
    const totalLectures = calculateNoOfLectures(courseData);
    const completedLectures = progressData.lectureCompleted.length;
    return Math.round((completedLectures / totalLectures) * 100);
  }

  const downloadCertificate = () => {
    const doc = new jsPDF()

    // Simple Certificate Design
    doc.setFont("helvetica", "bold")
    doc.setFontSize(30)
    doc.text("Certificate of Completion", 105, 50, { align: "center" })

    doc.setFont("helvetica", "normal")
    doc.setFontSize(20)
    doc.text("This is to certify that", 105, 80, { align: "center" })

    doc.setFont("helvetica", "bold")
    doc.setFontSize(25)
    doc.text(userData?.name || "Student", 105, 100, { align: "center" })

    doc.setFont("helvetica", "normal")
    doc.setFontSize(20)
    doc.text("has successfully completed the course", 105, 120, { align: "center" })

    doc.setFont("helvetica", "bold")
    doc.setFontSize(25)
    doc.text(courseData?.courseTitle || "Course Title", 105, 140, { align: "center" })

    if (courseData?.educator) {
      doc.setFontSize(16)
      doc.text(`Instructor: ${courseData.educator.name}`, 105, 160, { align: "center" })
    }

    doc.setFontSize(12)
    doc.text(`Completed on: ${new Date().toLocaleDateString()}`, 105, 180, { align: "center" })

    if (progressData?.certificateId) {
      doc.text(`Certificate ID: ${progressData.certificateId}`, 105, 190, { align: "center" })
    }

    doc.save(`${courseData?.courseTitle.replace(/\s+/g, '_')}_Certificate.pdf`)
  }

  return courseData ? (
    <>
      <div className='flex flex-col min-h-screen bg-background'>
        {/* Top Bar for Mobile / Compact */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b bg-card pt-24">
          <h2 className="font-semibold truncate max-w-[200px]">{courseData.courseTitle}</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <div className='flex flex-1 overflow-hidden pt-20 pb-5'>

          {/* Sidebar - Course Content */}
          <div className={cn(
            "fixed inset-y-0 left-0 z-50 w-80 bg-background/95 backdrop-blur-md border-r border-border/50 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:flex flex-col top-20 lg:top-0 bottom-0 h-[calc(100vh-5rem)] lg:h-full",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>

            <div className="p-4 border-b flex items-center justify-between">
              <h2 className='font-bold text-lg'>Course Content</h2>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-5 bg-card border-b space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium text-muted-foreground">
                  <span>Course Progress</span>
                  <span className="text-foreground">{calculateProgress()}%</span>
                </div>
                <Progress value={calculateProgress()} className="h-2 bg-muted-foreground/20" />
              </div>

              {calculateProgress() === 100 && (
                <Button onClick={downloadCertificate} size="sm" className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg shadow-emerald-600/20 transition-all">
                  <Award className="w-4 h-4" /> Download Certificate
                </Button>
              )}
            </div>

            <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted p-2'>
              {courseData && courseData.courseContent.map((chapter, index) => (
                <div key={index} className='mb-2 last:mb-0'>
                  <div
                    className='flex items-center justify-between px-3 py-3 cursor-pointer hover:bg-muted/50 transition-colors rounded-lg mb-1 group'
                    onClick={() => toggleSection(index)}
                  >
                    <div className='flex items-center gap-2'>
                      <div className={cn("w-6 h-6 flex items-center justify-center rounded-md bg-muted group-hover:bg-muted-foreground/20 transition-colors", openSections[index] ? "bg-primary/10 text-primary" : "text-muted-foreground")}>
                        <img className={`w-3 h-3 transition-transform opacity-60 dark:invert ${openSections[index] ? 'rotate-180 opacity-100' : ''}`} src={assets.down_arrow_icon} alt="arrow" />
                      </div>
                      <p className='font-semibold text-sm text-foreground'>{chapter.chapterTitle}</p>
                    </div>
                    <span className='text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full'>
                      {chapter.chapterContent.length} Lessons
                    </span>
                  </div>

                  <div className={cn("overflow-hidden transition-all duration-300", openSections[index] ? 'max-h-[999px]' : 'max-h-0')}>
                    <ul className='flex flex-col gap-1 pb-2 pl-2'>
                      {chapter.chapterContent.map((lecture: any, idx: number) => {
                        const isCompleted = progressData && progressData.lectureCompleted.includes(lecture.lectureId);
                        const isActive = playerData?.lectureId === lecture.lectureId;

                        return (
                          <li
                            key={idx}
                            className={cn(
                              'flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-all rounded-lg mx-2 border border-transparent',
                              isActive
                                ? 'bg-background shadow-sm border-border text-primary font-medium ring-1 ring-primary/10'
                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                            )}
                            onClick={() => {
                              lecture.lectureUrl && setPlayerData({ ...lecture, chapter: index + 1, lecture: idx + 1 });
                              setIsSidebarOpen(false);
                            }}
                          >
                            <div className="shrink-0">
                              {isCompleted ? <CheckCircle className="w-4 h-4 text-green-500 fill-green-500/20" /> : <PlayCircle className={cn("w-4 h-4", isActive ? "text-primary fill-primary/10" : "opacity-40")} />}
                            </div>
                            <div className='flex flex-col gap-0.5 flex-1'>
                              <span className="line-clamp-1">{lecture.lectureTitle}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-muted-foreground font-mono opacity-70">
                                  {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['m', 's'] })}
                                </span>
                              </div>
                            </div>
                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>}
                          </li>
                        )
                      })
                      }
                    </ul>
                  </div>
                </div>
              ))
              }
            </div>
          </div>

          {/* Main Content - Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className='flex-1 flex flex-col h-full overflow-y-auto bg-background'
          >
            <div className="p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-6">

              {/* Video Player or Quiz Player */}
              <div className="rounded-xl overflow-hidden shadow-2xl shadow-primary/20 border border-border/50 bg-black aspect-video relative group ring-1 ring-white/10">
                {playerData ? (
                  playerData.lectureType === 'quiz' ? (
                    <QuizPlayer
                      quizData={playerData.quizQuestions || []}
                      onComplete={() => markLectureCompleted(playerData.lectureId)}
                    />
                  ) : (
                    <YouTube
                      videoId={playerData.lectureUrl ? playerData.lectureUrl.split('/').pop() : ''}
                      iframeClassName='w-full h-full'
                      className='w-full h-full'
                      opts={{
                        playerVars: {
                          autoplay: 1,
                          modestbranding: 1,
                          rel: 0,
                          showinfo: 0
                        }
                      }}
                      onEnd={() => {
                        const currentChapterIndex = courseData?.courseContent.findIndex(ch => ch.chapterContent.some(l => l.lectureId === playerData.lectureId));
                        if (currentChapterIndex !== undefined && currentChapterIndex !== -1) {
                          const currentLectureIndex = courseData?.courseContent[currentChapterIndex].chapterContent.findIndex(l => l.lectureId === playerData.lectureId);
                          if (currentLectureIndex !== undefined && currentLectureIndex !== -1) {
                            if (progressData && !progressData.lectureCompleted.includes(playerData.lectureId)) {
                              markLectureCompleted(playerData.lectureId);
                            }
                            if (currentLectureIndex < courseData.courseContent[currentChapterIndex].chapterContent.length - 1) {
                              const nextLecture = courseData.courseContent[currentChapterIndex].chapterContent[currentLectureIndex + 1];
                              setPlayerData({ ...nextLecture, chapter: currentChapterIndex + 1, lecture: currentLectureIndex + 2 });
                            } else if (currentChapterIndex < courseData.courseContent.length - 1) {
                              const nextChapter = courseData.courseContent[currentChapterIndex + 1];
                              if (nextChapter.chapterContent.length > 0) {
                                const nextLecture = nextChapter.chapterContent[0];
                                setPlayerData({ ...nextLecture, chapter: currentChapterIndex + 2, lecture: 1 });
                                setOptionSections(prev => ({ ...prev, [currentChapterIndex + 1]: true }));
                              }
                            }
                          }
                        }
                      }}
                    />
                  )
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center justify-center text-center p-6 bg-background/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                      <PlayCircle className="w-14 h-14 text-primary/80 mb-4 animate-pulse" />
                      <h3 className="text-white font-semibold text-lg mb-1">Start Learning</h3>
                      <p className="text-white/70 text-sm">Select a lecture from the sidebar to begin</p>
                    </div>
                  </div>
                )
                }
              </div>

              {/* Player Header & Metadata */}
              {playerData && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                        {playerData.lectureTitle}
                      </h1>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium text-xs">
                          <PlayCircle className="w-3.5 h-3.5" />
                          Chapter {playerData.chapter} • Lesson {playerData.lecture}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {humanizeDuration(playerData.lectureDuration * 60 * 1000)}
                        </span>
                        {playerData.lectureType === 'live' && (
                          <span className="flex items-center gap-1.5 text-red-500 font-bold animate-pulse">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            LIVE
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Button
                        onClick={() => markLectureCompleted(playerData.lectureId)}
                        variant={progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? "secondary" : "default"}
                        className={cn(
                          "gap-2 h-10 px-5 transition-all",
                          progressData && progressData.lectureCompleted.includes(playerData.lectureId)
                            ? "bg-green-100/50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900"
                            : "shadow-lg shadow-primary/20 hover:shadow-primary/30"
                        )}
                      >
                        {progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? (
                          <> <CheckCircle className="w-4 h-4" /> Completed </>
                        ) : (
                          "Mark as Complete"
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Navigation Buttons - Styled specifically for desktop layout */}
                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/50">
                    <Button
                      disabled={playerData.chapter === 1 && playerData.lecture === 1}
                      onClick={() => {
                        const currentChapterIndex = courseData?.courseContent.findIndex(ch => ch.chapterContent.some(l => l.lectureId === playerData.lectureId));
                        if (currentChapterIndex !== undefined && currentChapterIndex !== -1) {
                          const currentLectureIndex = courseData?.courseContent[currentChapterIndex].chapterContent.findIndex(l => l.lectureId === playerData.lectureId);
                          if (currentLectureIndex > 0) {
                            const prevLecture = courseData.courseContent[currentChapterIndex].chapterContent[currentLectureIndex - 1];
                            setPlayerData({ ...prevLecture, chapter: currentChapterIndex + 1, lecture: currentLectureIndex });
                          } else if (currentChapterIndex > 0) {
                            const prevChapter = courseData.courseContent[currentChapterIndex - 1];
                            if (prevChapter.chapterContent.length > 0) {
                              const prevLecture = prevChapter.chapterContent[prevChapter.chapterContent.length - 1];
                              setPlayerData({ ...prevLecture, chapter: currentChapterIndex, lecture: prevChapter.chapterContent.length });
                            }
                          }
                        }
                      }}
                      variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </Button>
                    <Button
                      onClick={() => {
                        const currentChapterIndex = courseData?.courseContent.findIndex(ch => ch.chapterContent.some(l => l.lectureId === playerData.lectureId));
                        if (currentChapterIndex !== undefined && currentChapterIndex !== -1) {
                          const currentLectureIndex = courseData?.courseContent[currentChapterIndex].chapterContent.findIndex(l => l.lectureId === playerData.lectureId);
                          if (currentLectureIndex < courseData.courseContent[currentChapterIndex].chapterContent.length - 1) {
                            const nextLecture = courseData.courseContent[currentChapterIndex].chapterContent[currentLectureIndex + 1];
                            setPlayerData({ ...nextLecture, chapter: currentChapterIndex + 1, lecture: currentLectureIndex + 2 });
                          } else if (currentChapterIndex < courseData.courseContent.length - 1) {
                            const nextChapter = courseData.courseContent[currentChapterIndex + 1];
                            if (nextChapter.chapterContent.length > 0) {
                              const nextLecture = nextChapter.chapterContent[0];
                              setPlayerData({ ...nextLecture, chapter: currentChapterIndex + 2, lecture: 1 });
                              setOptionSections(prev => ({ ...prev, [currentChapterIndex + 1]: true }));
                            }
                          }
                        }
                      }}
                      variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
                      Next <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Tabs Section */}
              <div className="min-h-[400px]">
                <div className="flex items-center gap-6 border-b border-border mb-6">
                  {['Overview', 'Q&A', 'Resources', 'Notes'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "pb-3 text-sm font-medium transition-all relative",
                        activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode='wait'>
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'Overview' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm">
                          <h3 className="font-semibold text-lg mb-3">About this lecture</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            Dive deep into the core concepts of this module. In this lecture, we cover the fundamental principles
                            that build the foundation for the upcoming advanced topics. Ensure you have reviewed the prerequisites.
                          </p>
                        </div>

                        {/* Rating Card Moved Here */}
                        <div className="p-6 bg-gradient-to-br from-muted/50 to-muted/10 rounded-xl border border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="space-y-1 text-center md:text-left">
                            <div className="font-semibold text-foreground">Rate this course</div>
                            <p className="text-xs text-muted-foreground">Tell us about your learning experience</p>
                          </div>
                          <Rating initialRating={initialRating} onRate={HandleRating} />
                        </div>
                      </div>
                    )}

                    {activeTab === 'Q&A' && playerData && (
                      <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                        <LectureComments lectureId={playerData.lectureId} courseId={courseData._id} />
                      </div>
                    )}

                    {activeTab === 'Resources' && (
                      <div className="p-8 text-center bg-card rounded-xl border border-border/50 border-dashed">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium text-foreground">No resources attached</h3>
                        <p className="text-sm text-muted-foreground mt-1">This lecture currently has no downloadable materials.</p>
                      </div>
                    )}

                    {activeTab === 'Notes' && (
                      <div className="space-y-4">
                        {playerData && playerData.lectureId ? (
                          <>
                            <textarea
                              id="lecture-notes"
                              className="w-full min-h-[300px] p-4 bg-card border border-border rounded-xl focus:ring-1 focus:ring-primary focus:outline-none resize-none text-sm leading-relaxed"
                              placeholder="Start typing your notes for this lecture here... (Saved automatically)"
                              value={note}
                              onChange={(e) => {
                                setNote(e.target.value)
                                localStorage.setItem(`notes-${courseData._id}-${playerData.lectureId}`, e.target.value)
                              }}
                            />
                            <div className="flex justify-end">
                              <p className="text-xs text-muted-foreground italic">Notes are saved to your browser automatically.</p>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-xl border border-dashed border-border">
                            <FileText className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                            <h3 className="font-medium text-foreground mb-2">No lecture selected</h3>
                            <p className="text-sm text-muted-foreground">Select a lecture from the course content to take notes.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-auto">
              <Footer />
            </div>
          </motion.div>
        </div>
      </div >
    </>
  ) : <Loading />
}

export default Player
