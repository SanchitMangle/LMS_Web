import { assets } from '@/assets/assets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const Footer = () => {
  return (
    <footer className='bg-black text-white md:px-36 text-left w-full mt-24 border-t border-white/10'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-16'>
        <div className='flex flex-col md:items-start items-center w-full'>
          <div className="flex items-center gap-2 mb-4">
            <img src={assets.logo_dark} alt="logo" className="w-8 brightness-0 invert" />
            <span className="font-bold text-xl tracking-tight">Edemy</span>
          </div>
          <p className='text-gray-400 text-center md:text-left text-sm leading-relaxed max-w-sm'>
            Empowering learners worldwide with cutting-edge skills. Join our community and start your journey today.
          </p>
        </div>
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-bold text-white mb-6 text-sm uppercase tracking-wider'>Company</h2>
          <ul className='flex flex-col items-center md:items-start space-y-3 text-sm text-gray-400 font-medium'>
            <li><a href="#" className="hover:text-white transition-colors hover:underline underline-offset-4">Home</a></li>
            <li><a href="#" className="hover:text-white transition-colors hover:underline underline-offset-4">About us</a></li>
            <li><a href="#" className="hover:text-white transition-colors hover:underline underline-offset-4">Contact us</a></li>
            <li><a href="#" className="hover:text-white transition-colors hover:underline underline-offset-4">Privacy policy</a></li>
          </ul>
        </div>
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-bold text-white mb-6 text-sm uppercase tracking-wider'>Subscribe</h2>
          <p className='text-sm text-gray-400 mb-6 text-center md:text-left'>The latest news, articles, and resources, sent to your inbox weekly.</p>
          <div className='flex flex-col sm:flex-row items-center gap-3 w-full'>
            <Input
              type="email"
              placeholder='Enter your email'
              className='bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-primary/50 w-full sm:w-auto flex-1 h-11'
            />
            <Button className="w-full sm:w-auto h-11 px-6">Subscribe</Button>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-8 text-center text-sm text-gray-500">
        Copyright 2025 © Edemy. All Right Reserved.
      </div>
    </footer>
  )
}

export default Footer
