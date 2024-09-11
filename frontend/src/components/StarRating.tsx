import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface IStarRating {
 rating: number;
}
const StarRating = ({ rating }: IStarRating) => {
 return (
  <div className="flex">
   {[1, 2, 3, 4, 5].map((star) => (
    <Star
     key={star}
     className={cn(
      'size-[18px]',
      star <= rating
       ? 'text-yellow-400 fill-yellow-400'
       : 'text-yellow-400',
     )}
     size={20}
    />
   ))}
  </div>
 );
};

export default StarRating;
