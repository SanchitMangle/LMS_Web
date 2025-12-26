import { useContext, useEffect, useState } from 'react'
import Loading from '@/components/students/Loading'
import { AppContext } from '@/context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const StudentsEnrolled = () => {

  const { isEducator, backendUrl, getToken } = useContext(AppContext)!
  const [enrolledStudents, setEnrolledStudents] = useState<any[] | null>(null)

  const fechEnrooledStudentsData = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students', { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse())
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
    if (isEducator) {
      fechEnrooledStudentsData()
    }
  }, [isEducator])

  return enrolledStudents ? (
    <div className='min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='w-full'>
        <h2 className='text-3xl font-bold pb-6 font-outfit'>Students Enrolled</h2>
        <div className='rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm h-[calc(100vh-180px)] overflow-y-auto scrollbar-thin scrollbar-thumb-muted'>
          <table className='w-full text-left text-sm relative'>
            <thead className='bg-muted/50 text-muted-foreground uppercase font-semibold border-b text-xs sticky top-0 backdrop-blur-md z-10'>
              <tr>
                <th className='px-6 py-4 text-center hidden sm:table-cell'>#</th>
                <th className='px-6 py-4' >Student Name</th>
                <th className='px-6 py-4' >Course Title</th>
                <th className='px-6 py-4 hidden sm:table-cell' >Date</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border/50'>
              {
                enrolledStudents.map((item, index) => (
                  <tr key={index} className='hover:bg-muted/30 transition-colors group'>
                    <td className='px-6 py-4 text-center hidden sm:table-cell text-muted-foreground font-mono'>
                      {index + 1}
                    </td>
                    <td className='px-6 py-4 flex items-center gap-3'>
                      <div className="relative">
                        <img src={item.student.imageUrl} alt=""
                          className='w-10 h-10 rounded-full object-cover border border-border group-hover:border-primary/50 transition-colors' />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card"></span>
                      </div>
                      <span className='font-semibold text-foreground truncate group-hover:text-primary transition-colors'>{item.student.name}</span>
                    </td>
                    <td className='px-6 py-4 text-muted-foreground truncate max-w-xs group-hover:text-foreground transition-colors'>
                      {item.courseTitle}
                    </td>
                    <td className='px-6 py-4 text-muted-foreground hidden sm:table-cell'>
                      {new Date(item.purchaseDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : <Loading />
}

export default StudentsEnrolled
