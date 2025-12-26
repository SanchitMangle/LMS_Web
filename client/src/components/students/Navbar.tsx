import { useContext, useEffect, useState } from 'react'
import { assets } from '@/assets/assets'
import { Link } from 'react-router-dom'
import { useUser, UserButton, useClerk } from '@clerk/clerk-react'
import { AppContext } from '@/context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'

const Navbar = () => {

  const { openSignIn } = useClerk()
  const { user } = useUser()
  const { navigate, isEducator, setIsEducator, backendUrl, getToken } = useContext(AppContext)!
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator')
        return;
      }
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/update-role', { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        setIsEducator(true)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message)
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 70 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm border-b border-border/50 h-16' : 'h-20 bg-transparent border-transparent'} px-6 sm:px-10 md:px-14 lg:px-36 flex items-center justify-between z-50`}
      >
        <div className="flex items-center gap-5">
          <img
            onClick={() => navigate('/')}
            src={assets.logo}
            alt="Edemy Logo"
            className='w-28 lg:w-32 cursor-pointer transition-transform hover:scale-105 dark:invert'
          />
          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-muted-foreground hover:text-primary transition-all" aria-label="Go Back">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => navigate(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-muted-foreground hover:text-primary transition-all" aria-label="Go Forward">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className='hidden md:flex items-center gap-8 text-muted-foreground'>
          <div className='flex items-center gap-6'>
            <ModeToggle />
            {user &&
              <>
                <Button variant="ghost" onClick={becomeEducator} className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium hover:bg-transparent relative group">
                  {isEducator ? "Educator Dashboard" : "Become Educator"}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Button>
                <div className="h-5 w-px bg-border/50"></div>
                <Link to='/my-enrollments' className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium relative group">
                  My Enrollments
                  <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </>
            }
          </div>
          {user ? <UserButton /> :
            <Button onClick={() => openSignIn()} className='rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 px-8'>Create Account</Button>}
        </div>

        {/* Mobile Menu Toggle */}
        <div className='md:hidden flex items-center gap-4'>
          <ModeToggle />
          {user && <UserButton />}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-muted-foreground hover:text-foreground transition-colors outline-none p-1" aria-label="Toggle Menu">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown - Full Screen Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 md:hidden"
          >
            <div className="absolute top-6 right-6">
              {/* Close button handled by toggle in nav */}
            </div>

            <div className="flex flex-col items-center gap-8 text-xl font-medium w-full max-w-xs">
              {!user && (
                <Button onClick={() => { openSignIn(); setMobileMenuOpen(false) }} className='w-full h-12 text-lg shadow-glow'>Get Started</Button>
              )}

              {user && (
                <>
                  <Link to='/my-enrollments' onClick={() => setMobileMenuOpen(false)} className="text-foreground hover:text-primary transition-colors">My Enrollments</Link>
                  <button onClick={() => { becomeEducator(); setMobileMenuOpen(false); }} className="text-foreground hover:text-primary transition-colors">
                    {isEducator ? "Dashboard" : "Become Educator"}
                  </button>
                  <div className="w-12 h-0.5 bg-border/50 my-2"></div>
                  <UserButton />
                </>
              )}

              <Link to='/course-list' onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground hover:text-primary transition-colors text-base">Browse Courses</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
