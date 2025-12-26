import { assets } from '../../assets/assets'
import { FadeIn } from '../animations/AnimationWrapper'
import { Button } from '@/components/ui/button'

const CallToAction = () => {
  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0'>
      <FadeIn className="text-center space-y-4">
        <h1 className='text-xl md:text-4xl text-foreground font-bold font-outfit'>Learn anything, anytime, anywhere</h1>
        <p className='text-muted-foreground sm:text-sm max-w-xl mx-auto'>Unlock your potential with our expert-led courses. Join thousands of learners today.</p>
        <div className='flex items-center gap-6 mt-8 font-medium justify-center'>
          <Button size="lg" className="rounded-md bg-primary hover:bg-primary/90 text-white shadow-glow transition-all hover:scale-105">
            Get started
          </Button>
          <button className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors'>
            Learn more <img src={assets.arrow_icon} alt="arrow" className="w-4 h-4 dark:invert" />
          </button>
        </div>
      </FadeIn>
    </div>
  )
}

export default CallToAction
