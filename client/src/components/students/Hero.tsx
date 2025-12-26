import { assets } from '@/assets/assets'
import SearchBar from './SearchBar'
import { FadeIn, SlideUp } from '@/components/animations/AnimationWrapper'

const Hero = () => {
  return (
    <div className='relative w-full md:pt-48 pt-32 pb-24 px-7 md:px-7 text-center overflow-hidden'>
      {/* Background Mesh/Gradient */}
      <div className="absolute inset-0 -z-10 mesh-bg opacity-40 pointer-events-none" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <FadeIn duration={0.8} className='space-y-7 max-w-4xl mx-auto'>
        <h1 className='md:text-home-heading-large text-home-heading-small relative font-bold text-foreground tracking-tight leading-tight'>
          Empower your future with courses <br className="hidden md:block" />
          designed to <span className='text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600'>fit your choice.</span>
          <img
            src={assets.sketch}
            alt="sketch"
            className='md:block hidden absolute -bottom-7 right-0 animate-float invert dark:invert-0'
          />
        </h1>

        <SlideUp delay={0.2} className='md:block hidden text-muted-foreground max-w-2xl mx-auto text-lg'>
          We bring together world-class instructors, interactive content, and a supportive
          community to help you achieve your personal and professional goals.
        </SlideUp>

        <SlideUp delay={0.2} className='md:hidden text-muted-foreground max-w-sm mx-auto text-base'>
          We bring together world-class instructors to help you achieve your professional goals.
        </SlideUp>

        <SlideUp delay={0.4} className="pt-4">
          <SearchBar />
        </SlideUp>
      </FadeIn>
    </div>
  )
}

export default Hero
