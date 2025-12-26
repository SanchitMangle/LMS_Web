import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/context/AppContext'
import Loading from '@/components/students/Loading'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyCourses = () => {

  const { currency, isEducator, backendUrl, getToken } = useContext(AppContext)!

  const [courses, setCourses] = useState<any[] | null>(null)

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/courses', { headers: { Authorization: `Bearer ${token}` } })
      data.success && setCourses(data.courses)
    } catch (error: any) {
      console.log(error);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses()
    }
  }, [isEducator])

  return courses ? (
    <div className='h-screen flex flex-col items-start justify-between md:p-8 p-4 md:pb-0 pb-0 pt-8'>
      <div className='w-full'>
        <h2 className='text-3xl font-bold pb-6 font-outfit'>My Courses</h2>
        <div className='rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm h-[calc(100vh-180px)] overflow-y-auto scrollbar-thin scrollbar-thumb-muted'>
          <table className='w-full text-left text-sm relative'>
            <thead className='bg-muted/50 text-muted-foreground uppercase font-semibold border-b text-xs sticky top-0 backdrop-blur-md z-10'>
              <tr>
                <th className='px-6 py-4'>All Courses</th>
                <th className='px-6 py-4'>Earnings</th>
                <th className='px-6 py-4'>Students</th>
                <th className='px-6 py-4'>Published On</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border/50'>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course._id} className='hover:bg-muted/30 transition-colors group'>
                    <td className='px-6 py-4 flex items-center gap-4'>
                      <img src={course.courseThumbnail} alt="" className='w-16 h-10 object-cover rounded-md border border-border group-hover:border-primary/50 transition-colors' />
                      <span className='font-semibold text-foreground truncate max-w-xs block group-hover:text-primary transition-colors'>{course.courseTitle}</span>
                    </td>
                    <td className='px-6 py-4 text-muted-foreground font-mono'>
                      {currency}{Math.floor(course.coursePrice - course.discount * course.coursePrice / 100) * course.enrolledStudents.length}
                    </td>
                    <td className='px-6 py-4 text-muted-foreground'>
                      {course.enrolledStudents.length}
                    </td>
                    <td className='px-6 py-4 text-muted-foreground'>
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <p className="text-lg font-medium">No courses found</p>
                      <p className="text-sm">Get started by creating your first course.</p>
                      {/* You could link to Add Course here */}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : <Loading />
}

export default MyCourses
