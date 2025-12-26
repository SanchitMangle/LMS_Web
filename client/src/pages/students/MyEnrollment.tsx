import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { Line } from 'rc-progress'
import Footer from '../../components/students/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { FileX } from 'lucide-react'

const MyEnrollment = () => {

  const { enrolledCourses, calculateCourseDuration, navigate, fetchUserEnrolledCourses, backendUrl, userData, getToken, calculateNoOfLectures } = useContext(AppContext)!

  const [progressArray, setProgresArray] = useState<any[]>([])

  const getCourseProgress = async () => {
    try {
      const token = await getToken()
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(`${backendUrl}/api/user/get-course-progress`, { courseId: course._id }, { headers: { Authorization: `Bearer ${token}` } })
          let totalLecture = calculateNoOfLectures(course)
          const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0
          return { totalLecture, lectureCompleted }
        })
      )
      setProgresArray(tempProgressArray)
    } catch (error: any) {
      console.log(error);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses()
    }
  }, [userData])

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress()
    }
  }, [enrolledCourses])

  return (
    <>
      <div className='md:px-36 px-4 pt-24 md:pt-32 min-h-screen bg-background'>
        <div className="flex flex-col gap-1 mb-8">
          <h1 className='text-3xl font-bold font-outfit text-foreground'>My Enrollments</h1>
          <p className="text-muted-foreground text-sm">Track your learning progress and resume courses.</p>
        </div>

        <div className="rounded-2xl border border-border/50 overflow-hidden shadow-md bg-card/50 backdrop-blur-sm h-[calc(100vh-240px)] flex flex-col">
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-muted">
            {/* Desktop View - Table */}
            <table className='w-full text-left relative hidden md:table'>
              <thead className='bg-muted/80 backdrop-blur-md border-b border-border text-left sticky top-0 z-20'>
                <tr>
                  <th className='px-6 py-4 font-semibold text-foreground text-sm uppercase tracking-wider'>Course</th>
                  <th className='px-6 py-4 font-semibold text-foreground text-sm uppercase tracking-wider'>Duration</th>
                  <th className='px-6 py-4 font-semibold text-foreground text-sm uppercase tracking-wider'>Completed</th>
                  <th className='px-6 py-4 font-semibold text-foreground text-sm uppercase tracking-wider text-right'>Action</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border/30'>
                {enrolledCourses.length > 0 ? (
                  enrolledCourses.map((course, index) => (
                    <tr key={index} className='hover:bg-primary/5 transition-all duration-300 group'>
                      <td className='px-6 py-4'>
                        <div className="flex items-center gap-4">
                          <img src={course.courseThumbnail} alt="" className='w-28 rounded-xl object-cover border border-border/50 shadow-sm group-hover:scale-105 transition-transform duration-300' />
                          <div className='flex-1 min-w-[120px] space-y-2'>
                            <p className='font-bold text-foreground line-clamp-2 text-base group-hover:text-primary transition-colors'>{course.courseTitle}</p>
                            <div className="w-full max-w-[160px] space-y-1">
                              <div className="flex justify-between text-xs text-muted-foreground font-medium">
                                <span>Progress</span>
                                <span>{progressArray[index] ? Math.round((progressArray[index].lectureCompleted * 100) / progressArray[index].totalLecture) : 0}%</span>
                              </div>
                              <Line strokeWidth={4} percent={progressArray[index] ? (progressArray[index].lectureCompleted * 100) / progressArray[index].totalLecture : 0} className='rounded-full opacity-80' strokeColor={progressArray[index] && (progressArray[index].lectureCompleted * 100) / progressArray[index].totalLecture === 100 ? "#10b981" : "#8a2be2"} trailColor="rgba(255,255,255,0.1)" />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-muted-foreground font-mono text-sm font-medium'>
                        {calculateCourseDuration(course)}
                      </td>
                      <td className='px-6 py-4 text-muted-foreground'>
                        {progressArray[index] && (
                          <span className="inline-flex items-center gap-1 font-mono text-sm bg-background/50 px-2 py-1 rounded border border-border/50">
                            <span className="font-bold text-foreground">{progressArray[index].lectureCompleted}</span>
                            <span className="text-muted-foreground/50">/</span>
                            <span className="text-muted-foreground">{progressArray[index].totalLecture}</span>
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <Button
                          onClick={() => navigate('/player/' + course._id)}
                          size='sm'
                          className={`min-w-[100px] text-sm font-semibold shadow-lg transition-all ${progressArray[index] && progressArray[index].lectureCompleted / progressArray[index].totalLecture === 1
                            ? "bg-green-600 hover:bg-green-700 text-white shadow-green-500/20"
                            : "bg-primary hover:bg-primary/90 text-white shadow-primary/30 hover:-translate-y-0.5"
                            }`}
                        >
                          {progressArray[index] && progressArray[index].lectureCompleted / progressArray[index].totalLecture === 1 ? 'Completed' : 'Continue'}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 rounded-full bg-muted/50 border border-border/50">
                          <FileX className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <p className="text-lg font-medium text-foreground">No enrollments yet</p>
                        <p className="text-sm text-muted-foreground max-w-md">You haven't enrolled in any courses yet. Start learning today!</p>
                        <Button onClick={() => navigate('/course-list')} className="bg-foreground text-background hover:bg-foreground/90 mt-4 rounded-full px-6">Browse Courses</Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Mobile View - Cards List */}
            <div className="md:hidden p-4 space-y-4">
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map((course, index) => (
                  <div key={index} className="bg-card border border-border/50 rounded-xl p-4 shadow-sm flex flex-col gap-4">
                    <div className="flex gap-4">
                      <img src={course.courseThumbnail} alt="" className='w-20 h-20 rounded-lg object-cover border border-border/50' />
                      <div className="flex-1 space-y-1">
                        <p className='font-bold text-foreground text-sm line-clamp-2'>{course.courseTitle}</p>
                        <p className="text-xs text-muted-foreground font-mono">{calculateCourseDuration(course)} Duration</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground font-medium">
                        <span>Progress ({progressArray[index] ? `${progressArray[index].lectureCompleted}/${progressArray[index].totalLecture}` : '0/0'})</span>
                        <span>{progressArray[index] ? Math.round((progressArray[index].lectureCompleted * 100) / progressArray[index].totalLecture) : 0}%</span>
                      </div>
                      <Line strokeWidth={4} percent={progressArray[index] ? (progressArray[index].lectureCompleted * 100) / progressArray[index].totalLecture : 0} className='rounded-full opacity-80' strokeColor={progressArray[index] && (progressArray[index].lectureCompleted * 100) / progressArray[index].totalLecture === 100 ? "#10b981" : "#8a2be2"} trailColor="rgba(255,255,255,0.1)" />
                    </div>

                    <Button
                      onClick={() => navigate('/player/' + course._id)}
                      size='sm'
                      className={`w-full text-xs font-semibold shadow-lg transition-all ${progressArray[index] && progressArray[index].lectureCompleted / progressArray[index].totalLecture === 1
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-green-500/20"
                        : "bg-primary hover:bg-primary/90 text-white shadow-primary/30"
                        }`}
                    >
                      {progressArray[index] && progressArray[index].lectureCompleted / progressArray[index].totalLecture === 1 ? 'Completed' : 'Continue Course'}
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground flex flex-col items-center">
                  <FileX className="w-10 h-10 mb-2 opacity-50" />
                  <p>No enrollments found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default MyEnrollment
