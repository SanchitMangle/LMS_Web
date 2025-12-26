import { useEffect, useState } from 'react'
import { assets } from '@/assets/assets'

interface RatingProps {
  initialRating?: number
  onRate?: (rating: number) => void
}

const Rating: React.FC<RatingProps> = ({ initialRating, onRate }) => {

  const [rating, setRating] = useState(initialRating || 0)

  const handleRating = (value: number) => {
    setRating(value);
    if (onRate) onRate(value);
  }

  useEffect(() => {
    if (initialRating) {
      setRating(initialRating)
    }
  }, [initialRating]);

  return (
    <div className='flex items-center gap-1 cursor-pointer'>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        return (
          <span key={index} onClick={() => handleRating(starValue)} className="transition-transform hover:scale-110">
            <img
              src={starValue <= rating ? assets.star : assets.star_blank}
              className='w-6 h-6'
              alt={`${starValue} Stars`}
            />
          </span>
        );
      })}
    </div>
  )
}

export default Rating
