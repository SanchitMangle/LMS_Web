import React from 'react'
import {Routes,Route, useMatch} from 'react-router-dom'
import Home from './pages/students/Home'
import CoursesList from './pages/students/CoursesList'
import CourseDetails from './pages/students/CourseDetails'
import MyEnrollment from './pages/students/MyEnrollment'
import Player from './pages/students/Player'
import Loading from './components/students/Loading'
import Dashboard from './pages/educators/Dashboard'
import Educaators from './pages/educators/Educators'
import AddCourse from './pages/educators/AddCourse'
import MyCourses from './pages/educators/MyCourses'
import StudentsEnrolled from './pages/educators/StudentsEnrolled'
import Navbar from './components/students/Navbar'
import 'quill/dist/quill.snow.css'

const App = () => {

  const isEducatorsRoute = useMatch('/educator/*')


  return (
    <div className='text-default min-h-screen bg-white'>
      {!isEducatorsRoute &&  <Navbar/> }
      
      <Routes>
         <Route path='/' element={<Home/>} />
         <Route path='/course-list' element={<CoursesList/>}/>
         <Route path='/course-list/:input' element={<CoursesList/>}/>
         <Route path='/course-details' element={<CourseDetails/>}/>
         <Route path='/course/:id' element={<CourseDetails/>}/>
         <Route path='/my-enrollments' element={<MyEnrollment/>}/>
         <Route path='/player/:courseId' element={<Player/>}/>
         <Route path='/loading/:path' element={<Loading/>}/>

         <Route path='/educator' element={<Educaators/>}>
            <Route path='/educator' element={<Dashboard/>}/>
            <Route path='add-course' element={<AddCourse/>}/>
            <Route path='my-courses' element={<MyCourses/>}/>
            <Route path='student-enrolled' element={<StudentsEnrolled/>}/>
         </Route>

      </Routes>

    </div>
  )
}

export default App
