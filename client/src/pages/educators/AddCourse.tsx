import React, { useContext, useEffect, useRef, useState } from 'react'
import uniqid from 'uniqid'
import Quill from 'quill'
import { motion, AnimatePresence } from 'framer-motion'
import { AppContext } from '@/context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, ChevronDown, ChevronRight, X, Upload, PlusCircle } from 'lucide-react'
import LectureModal from '@/components/educators/LectureModal'

interface QuizQuestion {
  questionText: string
  options: string[]
  correctAnswerIndex: number
}

interface Lecture {
  lectureId: string
  lectureTitle: string
  lectureDuration: string
  lectureUrl: string
  isPreviewFree: boolean
  lectureOrder: number
  lectureType: 'video' | 'quiz'
  quizQuestions?: QuizQuestion[]
}

interface Chapter {
  chapterId: string
  chapterTitle: string
  chapterContent: Lecture[]
  collapsed: boolean
  chapterOrder: number
}

const AddCourse = () => {

  const { getToken, backendUrl } = useContext(AppContext)!

  const quillRef = useRef<Quill | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  const [courseTitle, setCourseTitle] = useState('')
  const [courseCategory, setCourseCategory] = useState('Technology')
  const [coursePrice, setCoursePrice] = useState<number | ''>('')
  const [discount, setDiscount] = useState<number | ''>('')
  const [image, setImage] = useState<File | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [showPopUp, setShowPopUp] = useState(false)
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null)

  // State for Add Lecture Modal is now handled in LectureModal component

  const handleChapter = (action: 'add' | 'remove' | 'toggle', chapterId?: string) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:');
      if (title) {
        const newChapter: Chapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        }
        setChapters([...chapters, newChapter])
      }
    }
    else if (action === 'remove' && chapterId) {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId))
    }
    else if (action === 'toggle' && chapterId) {
      setChapters(chapters.map((chapter) =>
        chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
      ))
    }
  }

  const handleLectures = (action: 'add' | 'remove', chapterId: string, lectureIndex?: number) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId)
      setShowPopUp(true)
    }
    else if (action === 'remove' && typeof lectureIndex === 'number') {
      setChapters(chapters.map((chapter) => {
        if (chapter.chapterId === chapterId) {
          chapter.chapterContent.splice(lectureIndex, 1)
        }
        return chapter
      }))
    }
  }

  const addLecture = (lectureData: any) => {
    if (!currentChapterId) return;

    setChapters(chapters.map((chapter) => {
      if (chapter.chapterId === currentChapterId) {
        const newLecture: Lecture = {
          ...lectureData,
          lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
          lectureId: uniqid(),
        }
        chapter.chapterContent.push(newLecture)
      }
      return chapter
    }));
    setShowPopUp(false);
  }

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!image) {
        toast.error('Thumbnail Not Selected')
        return
      }

      const courseData = {
        courseTitle,
        courseCategory,
        courseDescription: quillRef.current?.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters
      }

      const formData = new FormData()
      formData.append('courseData', JSON.stringify(courseData))
      formData.append('image', image)

      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/educator/add-course', formData, { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        toast.success(data.message)
        setCourseTitle('')
        setCourseCategory('Technology')
        setCoursePrice('')
        setDiscount('')
        setImage(null)
        setChapters([])
        if (quillRef.current) {
          quillRef.current.root.innerHTML = ''
        }
      }
      else {
        toast.error(data.message)
      }

    } catch (error: any) {
      console.log(error);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow'
      })
    }
  }, [])

  return (
    <div className='min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0 overflow-y-scroll scrollbar-hide'>
      <form onSubmit={onSubmitHandler} className='flex flex-col gap-8 max-w-5xl w-full text-foreground'>

        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold font-outfit">Add New Course</h1>
          <p className="text-sm text-muted-foreground">Create a comprehensive course for your students.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Basic Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className='p-6 border-border/50 shadow-sm bg-card rounded-2xl'>
              <div className="space-y-6">
                <div className='flex flex-col gap-2'>
                  <Label htmlFor="courseTitle" className="text-base font-medium">Course Title</Label>
                  <Input
                    id="courseTitle"
                    type="text"
                    placeholder='e.g. Advanced Web Development'
                    value={courseTitle}
                    onChange={e => setCourseTitle(e.target.value)}
                    required
                    className="bg-background/50 focus:bg-background h-11 transition-colors"
                  />
                </div>

                <div className='flex flex-col gap-2'>
                  <Label htmlFor="courseCategory" className="text-base font-medium">Course Category</Label>
                  <select
                    id="courseCategory"
                    className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    {['Technology', 'Business', 'Design', 'Marketing', 'Health', 'Creativity'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='flex flex-col gap-2'>
                    <Label htmlFor="coursePrice" className="text-base font-medium">Course Price</Label>
                    <Input
                      id="coursePrice"
                      type="number"
                      placeholder='0'
                      onChange={e => setCoursePrice(Number(e.target.value))}
                      value={coursePrice}
                      required
                      className="bg-background/50 h-11"
                    />
                  </div>

                  <div className='flex flex-col gap-2'>
                    <Label htmlFor="courseDiscount" className="text-base font-medium">Discount %</Label>
                    <Input
                      id="courseDiscount"
                      type="number"
                      placeholder='0'
                      onChange={e => setDiscount(Number(e.target.value))}
                      value={discount}
                      min={0}
                      max={100}
                      required
                      className="bg-background/50 h-11"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className='p-6 border-border/50 shadow-sm bg-card rounded-2xl overflow-hidden'>
              <div className='flex flex-col gap-2'>
                <Label className="text-base font-medium">Course Description</Label>
                <div className="bg-background/50 rounded-md border" style={{ minHeight: '200px' }}>
                  <div ref={editorRef} style={{ minHeight: '200px' }} className='prose dark:prose-invert max-w-none p-2'></div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Thumbnail & extra settings if any */}
          <div className="lg:col-span-1 space-y-6">
            <Card className='p-6 border-border/50 shadow-sm bg-card rounded-2xl'>
              <div className='flex flex-col gap-4'>
                <Label className="text-base font-medium">Course Thumbnail</Label>

                <label htmlFor='thumbnailImage' className='relative flex flex-col items-center justify-center w-full aspect-video bg-muted/30 rounded-xl cursor-pointer hover:bg-muted/50 transition-all border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 group overflow-hidden'>
                  {image ? (
                    <img className='w-full h-full object-cover rounded-xl' src={URL.createObjectURL(image)} alt="Preview" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform duration-300">
                      <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Click to upload</span>
                    </div>
                  )}
                  <input type="file" id='thumbnailImage' onChange={e => setImage(e.target.files ? e.target.files[0] : null)} accept='image/*' hidden />
                </label>

                {image && (
                  <Button type="button" variant="outline" size="sm" onClick={() => setImage(null)} className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200">
                    Remove Image
                  </Button>
                )}

                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                  <p>Upload your course thumbnail here.</p>
                  <p>Important guidelines: 1200x800 pixels or 12:8 Ratio. Supported: .jpg, .jpeg, or .png</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Adding chapters and lectures */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-2xl font-bold font-outfit">Curriculum</h2>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {
                chapters.map((chapter, chapterIndex) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    key={chapter.chapterId}
                  >
                    <Card className='overflow-hidden border-border/50 rounded-xl shadow-sm bg-card'>
                      <div className='flex items-center justify-between p-4 bg-muted/30 border-b transition-colors hover:bg-muted/50 group'>
                        <div className='flex items-center gap-3 cursor-pointer select-none' onClick={() => handleChapter('toggle', chapter.chapterId)}>
                          {chapter.collapsed ? <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" /> : <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />}
                          <span className='font-bold text-foreground'>Chapter {chapterIndex + 1}: <span className="font-normal text-muted-foreground ml-1">{chapter.chapterTitle}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className='text-xs font-medium text-muted-foreground bg-background px-2 py-1 rounded border'>{chapter.chapterContent.length} Lectures</span>
                          <Button variant="ghost" size="icon" onClick={() => handleChapter('remove', chapter.chapterId)} className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {
                        !chapter.collapsed && (
                          <div className='p-4 space-y-3 bg-card/50'>
                            {
                              chapter.chapterContent.map((lecture, lectureIndex) => (
                                <div key={lecture.lectureId} className='flex justify-between items-center p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all group/lecture'>
                                  <div className="flex items-center gap-3">
                                    <span className='flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-primary/20'>
                                      {lectureIndex + 1}
                                    </span>
                                    <div className="flex flex-col gap-0.5">
                                      <div className='flex items-center gap-2'>
                                        <span className="font-medium text-sm text-foreground">{lecture.lectureTitle}</span>
                                        <span className="text-[10px] uppercase font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground border">{lecture.lectureType}</span>
                                      </div>

                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>{lecture.lectureDuration} mins</span>
                                        <span>•</span>
                                        <span className={lecture.isPreviewFree ? "text-green-600 font-medium" : "text-amber-600"}>
                                          {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="icon" onClick={() => handleLectures('remove', chapter.chapterId, lectureIndex)} className="h-8 w-8 text-muted-foreground hover:text-red-500 opacity-0 group-hover/lecture:opacity-100 transition-opacity">
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))
                            }

                            <Button type="button" variant="ghost" size="sm" onClick={() => handleLectures('add', chapter.chapterId)} className="w-full flex items-center justify-center gap-2 border border-dashed border-border/50 py-6 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all rounded-lg mt-2">
                              <Plus className="w-4 h-4" /> Add Lecture to Chapter {chapterIndex + 1}
                            </Button>
                          </div>
                        )
                      }
                    </Card>
                  </motion.div>
                ))
              }
            </AnimatePresence>
          </div>

          <Button type="button" onClick={() => handleChapter('add')} variant="secondary" className="w-full py-6 text-base font-medium border-2 border-dashed border-border hover:border-primary/50 hover:text-primary transition-all bg-transparent hover:bg-primary/5">
            <PlusCircle className="mr-2 w-5 h-5" /> Add New Chapter
          </Button>

          <LectureModal
            isOpen={showPopUp}
            onClose={() => setShowPopUp(false)}
            onAdd={addLecture}
          />
        </div>


        <div className="sticky bottom-0 bg-background/80 backdrop-blur-md py-4 border-t mt-8 z-10 flex justify-end">
          <Button type="submit" size="lg" className="w-full md:w-auto px-10 text-lg rounded-xl shadow-lg hover:shadow-primary/25 transition-all">Publish Course</Button>
        </div>

      </form>
    </div>
  )
}

export default AddCourse
