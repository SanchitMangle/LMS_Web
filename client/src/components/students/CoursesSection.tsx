import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '@/context/AppContext'
import CourseCard from './CourseCard'
import { Button } from '@/components/ui/button'
import { FadeIn, StaggerContainer, StaggerItem, SlideUp } from '@/components/animations/AnimationWrapper'

const CoursesSection = () => {

  const { allCourses } = useContext(AppContext)!

  return (
    <div className='py-16 md:px-40 px-8'>
      <FadeIn className="text-center mb-16">
        <h2 className='text-3xl font-bold text-foreground font-outfit'>Learn from the best</h2>
        <p className='text-sm md:text-base text-muted-foreground mt-3 max-w-2xl mx-auto'>
          Discover our top-rated courses across various categories.
          From coding and design to business and wellness, our courses are crafted to deliver results.
        </p>
      </FadeIn>

      <StaggerContainer className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:my-16 my-10 gap-6'>
        {
          allCourses.slice(0, 8).map((course, index) => (
            <StaggerItem key={index}>
              <CourseCard course={course} />
            </StaggerItem>
          ))
        }
      </StaggerContainer>

      <SlideUp className="flex justify-center">
        <Link to='/course-list' onClick={() => scrollTo(0, 0)}>
          <Button variant="outline" size="lg" className="px-10 h-12 text-base hover:bg-primary/5 hover:text-primary transition-colors border-primary/20">
            Show all courses
          </Button>
        </Link>
      </SlideUp>
    </div>
  )
}

export default CoursesSection
