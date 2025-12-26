import { useState, FormEvent } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  data?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ data }) => {

  const navigate = useNavigate()
  const [input, setInput] = useState(data ? data : '')

  const onSearchHandler = (e: FormEvent) => {
    e.preventDefault()
    navigate('/course-list/' + input)
  }

  return (
    <form onSubmit={onSearchHandler} className='mx-auto max-w-xl w-full h-12 md:h-14 flex items-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-border/50 rounded-full shadow-lg overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50 transition-all'>
      <div className="pl-5 pr-2">
        <Search className='w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors' />
      </div>
      <input
        onChange={e => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder='Search for courses...'
        className='w-full h-full px-2 outline-none text-foreground bg-transparent border-none focus:ring-0 placeholder:text-muted-foreground/70 font-medium'
      />
      {input && (
        <button type="button" className="p-2 mr-2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setInput('')}>
          <X className="w-4 h-4" />
        </button>
      )}
      <Button type="submit" size="default" className='rounded-none rounded-r-full h-full px-8 text-base bg-primary hover:bg-primary/90'>Search</Button>
    </form>
  )
}

export default SearchBar
