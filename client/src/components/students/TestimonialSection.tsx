import { assets, dummyTestimonial } from '../../assets/assets'
import { FadeIn, StaggerContainer, StaggerItem } from '../animations/AnimationWrapper'

const TestimonialSection = () => {
  return (
    <div className='pb-14 px-8 md:px-0'>
      <FadeIn className="mb-10">
        <h2 className='text-3xl font-bold text-foreground font-outfit'>Testimonials</h2>
        <p className='md:text-base text-muted-foreground mt-3'>Hear from our learners as they share their journeys of transformation, success,<br /> and how our platform has made a difference in their lives.</p>
      </FadeIn>

      <StaggerContainer className='grid grid-cols-auto gap-8 mt-14'>
        {
          dummyTestimonial.map((testimonial, index) => (
            <StaggerItem key={index} className='text-sm text-left border border-border bg-card rounded-lg shadow-custom-card overflow-hidden hover:shadow-xl transition-shadow duration-300 group'>
              <div className='flex items-center gap-4 px-5 py-4 bg-muted/50 border-b border-border'>
                <img className='h-12 w-12 rounded-full ring-2 ring-background' src={testimonial.image} alt={testimonial.name} />
                <div>
                  <h1 className='text-lg font-bold text-foreground'>{testimonial.name}</h1>
                  <p className='text-muted-foreground text-xs'>{testimonial.role}</p>
                </div>

              </div>
              <div className='p-5 pb-7'>
                <div className='flex gap-0.5'>
                  {
                    [...Array(5)].map((_, i) => (
                      <img className='h-4 w-4' key={i} src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank} alt="star" />
                    ))
                  }
                </div>
                <p className='text-muted-foreground mt-5 leading-relaxed group-hover:text-foreground transition-colors'>{testimonial.feedback}</p>
              </div>
              <div className="px-5 pb-5">
                <a href="#" className='text-primary font-medium underline-offset-4 hover:underline'>Read more</a>
              </div>
            </StaggerItem>
          ))
        }
      </StaggerContainer>
    </div>
  )
}

export default TestimonialSection
