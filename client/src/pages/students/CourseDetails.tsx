import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext, Course } from '../../context/AppContext'
import Loading from '../../components/students/Loading'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Footer from '../../components/students/Footer'
import YouTube from 'react-youtube'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronDown, Clock, BookOpen, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FadeIn, SlideUp } from '@/components/animations/AnimationWrapper'

const CourseDetails = () => {

  const { id } = useParams()
  const [courseData, setCourseData] = useState<Course | null>(null)
  const [openSections, setOptionSections] = useState<{ [key: number]: boolean }>({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [playerData, setPlayerData] = useState<{ videoId: string } | null>(null)

  const { calculateRating, calculateCourseChapterTime, calculateCourseDuration,
    calculateNoOfLectures, currency, backendUrl, userData, getToken } = useContext(AppContext)!

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/course/' + id)
      if (data.success) {
        setCourseData(data.courseData)
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.error('Login to Enroll')
      }
      if (isAlreadyEnrolled) {
        return toast.warn('Already Enrolled')
      }

      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/user/purchase', { courseId: courseData?._id }, { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        const { session_url } = data
        window.location.replace(session_url)
      } else {
        toast.error(data.message)
      }

    } catch (error: any) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const toggleSection = (index: number) => {
    setOptionSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  useEffect(() => {
    fetchCourseData()
  }, [id])

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id))
    }
  }, [userData, courseData])

  return courseData ? (
    <>
      <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-4 md:pt-32 pt-24 text-left min-h-screen bg-background'>
        {/* Background Gradient */}
        <div className='absolute left-0 top-0 w-full h-[500px] -z-10 bg-gradient-to-b from-cyan-100/30 to-background dark:from-cyan-900/20 pointer-events-none' />

        {/* Left column */}
        <FadeIn className='max-w-xl z-10 w-full'>
          <h1 className='text-3xl md:text-4xl font-bold text-foreground mb-4 font-outfit'>{courseData.courseTitle}</h1>
          <div className='prose prose-sm md:prose-base text-muted-foreground mb-6 dark:prose-invert' // Added dark:prose-invert
            dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) + '...' }}></div>

          <div className='flex items-center space-x-2 pb-6 text-sm text-muted-foreground'>
            <div className="flex items-center text-amber-500 font-medium">
              <span className="mr-1">{calculateRating(courseData)}</span>
              <div className='flex'>
                {
                  [...Array(5)].map((_, i) => (
                    <img className='w-4 h-4' src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} key={i} alt="" />
                  ))
                }
              </div>
            </div>
            <span>•</span>
            <p className='text-blue-600'>({courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? 'ratings' : 'rating'})</p>
            <span>•</span>
            <p>{courseData.enrolledStudents.length} learners</p>
          </div>

          <div className="flex items-center gap-2 mb-8 text-sm">
            <span className="text-muted-foreground">Course By:</span>
            <span className='font-medium text-foreground underline decoration-blue-500/30 cursor-pointer hover:text-blue-600 transition-colors'>{courseData.educator.name}</span>
          </div>

          <div className='pt-8 border-t border-border'>
            <h2 className='text-xl font-bold mb-6 font-outfit text-foreground'>Course Structure</h2> {/* Explicit text-foreground */}

            <div className='relative pl-8 space-y-6 border-l-2 border-muted ml-3'>
              {
                courseData.courseContent.map((chapter, index) => (
                  <div key={index} className='relative group'>
                    {/* Timeline Node */}
                    <div className='absolute -left-[41px] top-3.5 w-7 h-7 flex items-center justify-center bg-background border-2 border-primary rounded-full z-10 transition-colors group-hover:bg-primary group-hover:border-primary delay-100'>
                      <span className='w-2 h-2 bg-primary rounded-full group-hover:bg-white transition-colors'></span>
                    </div>

                    <Card className='overflow-hidden border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 bg-card'>
                      <div className='flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors select-none' onClick={() => toggleSection(index)}>
                        <div className='flex items-center gap-3'>
                          <ChevronDown className={cn("w-5 h-5 transition-transform text-muted-foreground", openSections[index] && "rotate-180")} />
                          <p className='font-medium text-foreground'>{chapter.chapterTitle}</p>
                        </div>
                        <p className='text-xs md:text-sm text-muted-foreground'>{chapter.chapterContent.length} lectures • {calculateCourseChapterTime(chapter)}</p>
                      </div>

                      <div className={cn("overflow-hidden transition-all duration-300 ease-in-out", openSections[index] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0')}>
                        <ul className='flex flex-col border-t border-border/50 bg-muted/10'> {/* Adjusted bg opacity */}
                          {
                            chapter.chapterContent.map((lecture: any, idx: number) => (
                              <li key={idx} className='flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/30 transition-colors group/lecture'>
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <img src={assets.play_icon} alt="" className='h-4 w-4 opacity-70 shrink-0 group-hover/lecture:opacity-100 transition-opacity dark:invert' /> {/* Added dark:invert for icon if needed, though svg usually better */}
                                  <p className="text-sm text-foreground truncate">{lecture.lectureTitle}</p>
                                </div>
                                <div className='flex items-center gap-3 shrink-0'>
                                  {lecture.isPreviewFree && (
                                    <span
                                      onClick={() => setPlayerData({ videoId: lecture.lectureUrl.split('/').pop() })}
                                      className='text-xs font-medium text-blue-600 cursor-pointer hover:underline'
                                    >
                                      Preview
                                    </span>
                                  )}
                                  <span className="text-xs text-muted-foreground font-mono">
                                    {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}
                                  </span>
                                </div>
                              </li>
                            ))
                          }
                        </ul>
                      </div>
                    </Card>
                  </div>
                ))
              }
            </div>
          </div>

          <div className='py-12'>
            <h3 className='text-xl font-bold mb-4 font-outfit text-foreground'>Description</h3>
            <div className='rich-text' dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}></div>
          </div>

        </FadeIn>

        {/* Right column */}
        <div className='w-full max-w-[420px] z-10 sticky top-24'>
          <SlideUp delay={0.2} className="bg-card rounded-xl shadow-xl overflow-hidden border border-border/50">
            {
              playerData ? <YouTube videoId={playerData.videoId} opts={{ playerVars: { autoplay: 1 } }} iframeClassName='w-full aspect-video' />
                : <div className="aspect-video w-full overflow-hidden relative group cursor-pointer" onClick={() => courseData.courseContent.find(c => c.chapterContent.find((l: any) => l.isPreviewFree)) && setPlayerData({ videoId: courseData.courseContent[0]?.chapterContent[0]?.lectureUrl.split('/').pop() || '' })}>
                  <img src={courseData.courseThumbnail} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-background/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <img src={assets.play_icon} className="w-6 h-6 ml-1" />
                    </div>
                  </div>
                </div>
            }

            <div className="p-6">
              <div className='flex items-center gap-2 mb-6'>
                <Clock className="w-4 h-4 text-red-500" />
                <p className='text-red-500 text-sm font-medium'><span className='font-bold'>5 days</span> left at this price</p>
              </div>

              <div className='flex items-baseline gap-3 mb-6'>
                <p className='text-4xl font-bold tracking-tight text-foreground'>{currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}</p>
                <p className='text-lg text-muted-foreground line-through decoration-muted-foreground/50'>{currency}{courseData.coursePrice}</p>
                <div className="px-2 py-1 rounded bg-red-100 text-red-600 text-xs font-bold">{courseData.discount}% OFF</div>
              </div>

              <div className='space-y-4 mb-6 pt-6 border-t border-border'>
                <div className='flex items-center gap-3 text-sm text-foreground/80'>
                  <Star className="w-5 h-5 text-amber-500" />
                  <div className="flex flex-col">
                    <span className="font-semibold">{calculateRating(courseData)} Rating</span>
                    <span className="text-xs text-muted-foreground">Highest Rated</span>
                  </div>
                </div>

                <div className='flex items-center gap-3 text-sm text-foreground/80'>
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div className="flex flex-col">
                    <span className="font-semibold">{calculateCourseDuration(courseData)}</span>
                    <span className="text-xs text-muted-foreground">Total Duration</span>
                  </div>
                </div>

                <div className='flex items-center gap-3 text-sm text-foreground/80'>
                  <BookOpen className="w-5 h-5 text-green-500" />
                  <div className="flex flex-col">
                    <span className="font-semibold">{calculateNoOfLectures(courseData)} Lectures</span>
                    <span className="text-xs text-muted-foreground">Comprehensive Curriculum</span>
                  </div>
                </div>
              </div>

              <Button size="lg" className="w-full text-base font-semibold h-12 shadow-glow" onClick={enrollCourse}>
                {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
              </Button>

              <div className='pt-8 mt-6 border-t border-border'>
                <p className='text-sm font-bold text-foreground mb-3'>What’s in the course?</p>
                <ul className='space-y-2 text-sm text-muted-foreground'>
                  <li className="flex gap-2">✓ Lifetime access with free updates</li>
                  <li className="flex gap-2">✓ Step-by-step, hands-on project guidance</li>
                  <li className="flex gap-2">✓ Downloadable resources and source code</li>
                  <li className="flex gap-2">✓ Quizzes to test your knowledge</li>
                  <li className="flex gap-2">✓ Certificate of completion</li>
                </ul>
              </div>

            </div>
          </SlideUp>
        </div>

      </div>
      <Footer />
    </>
  ) : <Loading />
}

export default CourseDetails
