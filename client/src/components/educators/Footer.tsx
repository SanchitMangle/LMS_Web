import { assets } from '@/assets/assets'

const Footer = () => {
  return (
    <footer className='flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 py-6 bg-card border-t mt-auto'>

      <div className='flex items-center gap-4'>
        <img src={assets.logo} alt="Logo" className='md:block hidden w-20 opacity-80' />
        <div className='md:block hidden h-6 w-px bg-border'></div>
        <p className='text-xs md:text-sm text-muted-foreground'>
          All rights reserved. Copyright 2025 © Edemy
        </p>
      </div>

      <div className='flex items-center gap-4 max-md:mb-4 opacity-70'>
        <a href="#" className="hover:opacity-100 transition-opacity">
          <img src={assets.facebook_icon} alt="Facebook" className="w-5" />
        </a>
        <a href="#" className="hover:opacity-100 transition-opacity">
          <img src={assets.instagram_icon} alt="Instagram" className="w-5" />
        </a>
        <a href="#" className="hover:opacity-100 transition-opacity">
          <img src={assets.twitter_icon} alt="Twitter" className="w-5" />
        </a>
      </div>

    </footer>
  )
}

export default Footer
