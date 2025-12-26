import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const Loading = () => {

  const { path } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [path, navigate])

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading content...</p>
      </div>
    </div>
  )
}

export default Loading
