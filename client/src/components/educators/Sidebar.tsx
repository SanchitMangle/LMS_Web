import { useContext } from 'react'
import { AppContext } from '@/context/AppContext'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, BookOpen, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const Sidebar = () => {

  const { isEducator } = useContext(AppContext)!

  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: LayoutDashboard },
    { name: 'Add Course', path: '/educator/add-course', icon: PlusCircle },
    { name: 'My Courses', path: '/educator/my-courses', icon: BookOpen },
    { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: Users },
  ]

  return isEducator ? (
    <div className='md:w-64 w-16 border-r bg-background min-h-[calc(100vh-64px)] flex flex-col'>
      {/* Menu Options */}
      <div className="flex-1 py-6 flex flex-col gap-2">
        {
          menuItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === '/educator'}
              className={({ isActive }) => cn(
                "flex items-center md:flex-row flex-col md:justify-start justify-center py-3 px-3 mx-3 rounded-lg gap-3 transition-all duration-200",
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <item.icon className={cn("w-5 h-5", ({ isActive }: { isActive: boolean }) => isActive ? "text-primary" : "text-muted-foreground")} />
              <p className='md:block hidden text-sm leading-none'>{item.name}</p>
            </NavLink>
          ))
        }
      </div>

      {/* Example Footer Section for consistency */}
      <div className='p-4 border-t'>
        {/* Could add 'Settings' or 'Help' here */}
      </div>

    </div>
  ) : null
}

export default Sidebar
