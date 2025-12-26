import { Outlet } from 'react-router-dom'
import Navbar from '@/components/educators/Navbar'
import Sidebar from '@/components/educators/Sidebar'
import Footer from '@/components/educators/Footer'

const Educators = () => {
  return (
    <div className='text-default min-h-screen bg-background font-sans'>
      <Navbar />
      <div className='flex'>
        <Sidebar />
        <div className='flex-1 p-0 overflow-y-auto bg-muted/20 min-h-[calc(100vh-64px)]'>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Educators
