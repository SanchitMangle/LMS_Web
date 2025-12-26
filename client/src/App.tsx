import { Routes, Route, useMatch } from 'react-router-dom'
import Navbar from '@/components/students/Navbar'
import Loading from '@/components/students/Loading'
import { ToastContainer } from 'react-toastify';
import 'quill/dist/quill.snow.css'
import { Suspense, lazy } from 'react'

import { ScrollProgress } from '@/components/ui/scroll-progress'
import { ScrollToTop } from '@/components/ui/scroll-to-top'
import { useTheme } from '@/components/theme-provider'

const Home = lazy(() => import('@/pages/students/Home'))
const CoursesList = lazy(() => import('@/pages/students/CoursesList'))
const CourseDetails = lazy(() => import('@/pages/students/CourseDetails'))
const MyEnrollment = lazy(() => import('@/pages/students/MyEnrollment'))
const Player = lazy(() => import('@/pages/students/Player'))
const Dashboard = lazy(() => import('@/pages/educators/Dashboard'))
const Educaators = lazy(() => import('@/pages/educators/Educators'))
const AddCourse = lazy(() => import('@/pages/educators/AddCourse'))
const MyCourses = lazy(() => import('@/pages/educators/MyCourses'))
const StudentsEnrolled = lazy(() => import('@/pages/educators/StudentsEnrolled'))

const App = () => {

  const isEducatorsRoute = useMatch('/educator/*')
  const { theme } = useTheme()

  return (
    <div className='text-default min-h-screen bg-background text-foreground'>
      <ScrollProgress />
      <ScrollToTop />
      <ToastContainer theme={theme === 'dark' ? 'dark' : 'light'} />
      {!isEducatorsRoute && <Navbar />}

      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/course-list' element={<CoursesList />} />
          <Route path='/course-list/:input' element={<CoursesList />} />
          <Route path='/course-details' element={<CourseDetails />} />
          <Route path='/course/:id' element={<CourseDetails />} />
          <Route path='/my-enrollments' element={<MyEnrollment />} />
          <Route path='/player/:courseId' element={<Player />} />
          <Route path='/loading/:path' element={<Loading />} />

          <Route path='/educator' element={<Educaators />}>
            <Route path='/educator' element={<Dashboard />} />
            <Route path='add-course' element={<AddCourse />} />
            <Route path='my-courses' element={<MyCourses />} />
            <Route path='student-enrolled' element={<StudentsEnrolled />} />
          </Route>

        </Routes>
      </Suspense>

    </div>
  )
}

export default App
