import { assets } from '@/assets/assets'
import { useUser, UserButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const Navbar = () => {

  const { user } = useUser()

  return (
    <div className='flex items-center justify-between px-4 md:px-8 bg-card border-b h-16 sticky top-0 z-50'>
      <Link to={'/'}>
        <img src={assets.logo} alt="Logo" className='w-24 md:w-28 cursor-pointer transition-transform hover:scale-105 dark:invert' />
      </Link>
      <div className='flex items-center gap-4 text-muted-foreground'>
        <p className="text-sm hidden md:block">Hi! {user ? user.fullName : 'Developer'}</p>
        {user ? <UserButton /> : <img src={assets.profile_img} className='w-8 h-8 rounded-full border' />}
      </div>

    </div>
  )
}

export default Navbar
