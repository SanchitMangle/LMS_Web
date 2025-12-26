
import { useContext, useEffect, useState } from 'react'
import { AppContext, Course } from '@/context/AppContext'
import SearchBar from '@/components/students/SearchBar'
import { useParams } from 'react-router-dom'
import CourseCard from '@/components/students/CourseCard'
import Footer from '@/components/students/Footer'
import { Card } from '@/components/ui/card'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations/AnimationWrapper'
import { Filter, X, FileX, RotateCcw } from 'lucide-react'

const CoursesList = () => {

  const { navigate, allCourses } = useContext(AppContext)!
  const { input } = useParams()
  const [filteredCourse, setFilteredCourse] = useState<Course[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string[]>([])
  const [sortOrder] = useState<string>('low-high')

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      let tempCourses = allCourses.slice()

      if (input) {
        tempCourses = tempCourses.filter(
          item => item.courseTitle.toLowerCase().includes(input.toLowerCase())
        )
      }

      if (selectedCategory.length > 0) {
        tempCourses = tempCourses.filter(item =>
          selectedCategory.some(cat =>
            new RegExp(`^ ${cat} $`, 'i').test(item.courseCategory)
          )
        )
      }

      if (sortOrder === 'low-high') {
        tempCourses.sort((a, b) => (a.coursePrice - a.discount * a.coursePrice / 100) - (b.coursePrice - b.discount * b.coursePrice / 100))
      } else {
        tempCourses.sort((a, b) => (b.coursePrice - b.discount * b.coursePrice / 100) - (a.coursePrice - a.discount * a.coursePrice / 100))
      }

      setFilteredCourse(tempCourses)
    }

  }, [input, allCourses, selectedCategory, sortOrder])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  return (
    <>
      <div className='relative min-h-screen bg-background text-left'>
        {/* Hero Section */}
        <div className="relative pt-24 md:pt-32 pb-20 px-4 md:px-8 bg-gradient-to-b from-primary/5 to-background dark:from-primary/10">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <FadeIn>
              <h1 className='text-4xl md:text-5xl font-bold font-outfit mb-4'>Explore Our <span className="text-gradient">Course Library</span></h1>
              <p className='text-muted-foreground text-lg max-w-2xl mx-auto mb-10'>
                Discover top-rated courses across various domains. From coding to design, master new skills with our expert-led curriculum.
              </p>
              <div className="w-full max-w-2xl mx-auto">
                <SearchBar data={input} />
              </div>
            </FadeIn>

            {input && (
              <div className='inline-flex items-center gap-2 px-6 py-2 border border-border rounded-full mt-8 bg-background/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2'>
                <p className="text-sm text-foreground">Showing results for: <span className="font-semibold text-primary">{input}</span></p>
                <button onClick={() => navigate('/course-list')} className="p-1 hover:bg-muted rounded-full transition-colors ml-2">
                  <X className="w-3.5 h-3.5 opacity-70" />
                </button>
              </div>
            )}
          </div>
        </div>


        <div className='max-w-7xl mx-auto px-4 md:px-8 pb-32 flex md:flex-row flex-col gap-10'>
          {/* Filter Sidebar */}
          <FadeIn delay={0.2} className='md:w-1/4 w-full h-fit sticky top-24'>
            <Card className='p-6 shadow-sm border-border/50 bg-card/50 backdrop-blur-xl'>
              <div className="flex items-center justify-between gap-2 mb-6 text-foreground">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  <h3 className='font-semibold text-lg'>Filter by Category</h3>
                </div>
                <button
                  onClick={() => { navigate('/course-list'); setSelectedCategory([]); }}
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-all"
                  title="Reset Filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className='space-y-3'>
                {['Technology', 'Business', 'Design', 'Marketing', 'Health', 'Creativity'].map((cat, index) => (
                  <div key={index} className='flex items-center gap-3 group cursor-pointer' onClick={() => handleCategoryChange(cat)}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedCategory.includes(cat) ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30 group-hover:border-primary/50'}`}>
                      {selectedCategory.includes(cat) && <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </div>
                    <label className={`text-sm cursor-pointer select-none transition-colors ${selectedCategory.includes(cat) ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>{cat}</label>
                  </div>
                ))}
              </div>
            </Card>
          </FadeIn>

          {/* Courses Grid */}
          <div className='flex-1'>
            {filteredCourse.length > 0 ? (
              <StaggerContainer className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6'>
                {
                  filteredCourse.map((course, index) => (
                    <StaggerItem key={index}>
                      <CourseCard course={course} />
                    </StaggerItem>
                  ))
                }
              </StaggerContainer>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-card/30 rounded-2xl border border-dashed border-border/50">
                <FileX className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <p className="text-xl font-medium text-foreground">No courses found matching your criteria</p>
                <p className="text-muted-foreground mt-2 mb-6">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => { navigate('/course-list'); setSelectedCategory([]) }}
                  className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-full shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  Reset all Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CoursesList
