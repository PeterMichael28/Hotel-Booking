import { Link } from 'react-router-dom';
import { HotelType } from '../../../../backend/src/shared/types';
import StarRating from '../StarRating';
type Props = {
 hotel: HotelType;
};

const SearchResultsCard = ({ hotel }: Props) => {
 return (
  <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8">
   <div className="w-full h-[300px]">
    <img
     alt={hotel.name}
     src={hotel.imageUrls[0]}
     className="w-full h-full object-cover object-center"
    />
   </div>
   <div className="grid grid-rows-[1fr_2fr_1fr]">
    <div className="flex justify-between items-start">
     <div className="">
      <div className="flex items-center">
       <span className="flex">
        {/* {Array.from({ length: hotel.starRating }).map(() => (
         <AiFillStar className="fill-yellow-400" />
        ))} */}
        <StarRating rating={hotel.starRating} />
       </span>
       <span className="ml-1 text-sm">{hotel.type}</span>
      </div>
      <Link
       to={`/detail/${hotel._id}`}
       className="text-2xl font-bold cursor-pointer"
      >
       {hotel.name}
      </Link>
     </div>

     <div className="flex flex-col items-end gap-1">
      <span className="font-bold">
       £{hotel.pricePerNight} per night
      </span>
      <Link
       to={`/detail/${hotel._id}`}
       className="bg-blue-600 text-white h-full px-4 py-2 rounded-md transition-all duration-300 font-semibold  max-w-fit hover:bg-blue-500"
      >
       View More
      </Link>
     </div>
    </div>

    <div>
     <div className="line-clamp-4">{hotel.description}</div>
    </div>

    <div className="grid grid-cols-1 items-end whitespace-nowrap">
     <div className="flex gap-1 items-center">
      {hotel.facilities.slice(0, 3).map((facility) => (
       <span className="bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-nowrap">
        {facility}
       </span>
      ))}
      <span className="text-sm">
       {hotel.facilities.length > 3 &&
        `+${hotel.facilities.length - 3} more`}
      </span>
     </div>
    </div>
   </div>
  </div>
 );
};

export default SearchResultsCard;
