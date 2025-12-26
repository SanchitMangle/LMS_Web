import { useContext } from 'react'
import { assets } from '@/assets/assets'
import { AppContext, Course } from '@/context/AppContext'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'

interface CourseCardProps {
  course: Course
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {

  const { currency, calculateRating } = useContext(AppContext)!

  return (
    <Link to={'/course/' + course._id} onClick={() => scrollTo(0, 0)} className='block h-full group'>
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 border-border/50 bg-card/60 backdrop-blur-md rounded-2xl group-hover:border-primary/20 flex flex-col">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <img
            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
            src={course.courseThumbnail}
            alt={course.courseTitle}
          />
          {/* Floating Rating Badge */}
          <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white/10">
            <img src={assets.star} alt="star" className="w-3.5 h-3.5" />
            <span className="text-xs font-bold text-foreground">{calculateRating(course)}</span>
          </div>

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-5 flex flex-col gap-3 flex-1">
          <h3 className="text-lg font-bold font-outfit line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {course.courseTitle}
          </h3>

          <div className='flex items-center gap-2 mt-1'>
            <div className='h-8 w-8 rounded-full bg-muted overflow-hidden shrink-0 border border-border/50'>
              {/* Placeholder or actual educator image if we had it */}
              <div className="w-full h-full bg-primary/5 flex items-center justify-center text-xs font-bold text-primary">
                {course.educator.name.charAt(0)}
              </div>
            </div>
            <p className='text-sm text-muted-foreground line-clamp-1 font-medium'>{course.educator.name}</p>
          </div>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">
                {currency}{(course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)}
              </span>
              {course.discount > 0 && <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/50">
                {currency}{course.coursePrice.toFixed(2)}
              </span>}
            </div>
            <div className="text-sm font-semibold px-4 py-1.5 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm group-hover:shadow-md">
              Enroll Now
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default CourseCard
