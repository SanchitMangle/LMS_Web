import { assets } from '../../assets/assets'
import { FadeIn } from '../animations/AnimationWrapper'

const Companies = () => {
  return (
    <div className='pt-16'>
      <p className='text-base text-muted-foreground mb-8'>Trusted by learners from</p>
      <FadeIn className='flex flex-wrap items-center justify-center gap-6 md:gap-16 md:mt-10 mt-5'>
        <img src={assets.microsoft_logo} alt="Microsoft" className='w-20 md:w-28 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer' />
        <img src={assets.walmart_logo} alt="Walmart" className='w-20 md:w-28 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer' />
        <img src={assets.accenture_logo} alt="Accenture" className='w-20 md:w-28 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer' />
        <img src={assets.adobe_logo} alt="Adobe" className='w-20 md:w-28 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer' />
        <img src={assets.paypal_logo} alt="Paypal" className='w-20 md:w-28 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-pointer' />
      </FadeIn>
    </div>
  )
}

export default Companies
