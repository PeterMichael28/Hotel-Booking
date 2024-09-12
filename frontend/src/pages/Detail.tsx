import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import * as apiClient from './../api-client';
import GuestInfoForm from '@/components/forms/GuestInfoForm/GuestInfoForm';
import StarRating from '@/components/StarRating';

const DetailsPage = () => {
 const { hotelId } = useParams();
 const navigate = useNavigate();

 const { data: hotel } = useQuery(
  'fetchHotelById',
  () => apiClient.fetchHotelById(hotelId || ''),
  {
   enabled: !!hotelId,
  },
 );

 if (!hotel) {
  navigate(-1);
  return <></>;
 }

 return (
  <div className="space-y-6">
   <div>
    <span className="flex">
     <StarRating rating={hotel.starRating} />
    </span>
    <h1 className="text-3xl font-bold">{hotel.name}</h1>
   </div>

   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {hotel.imageUrls.map((image, i) => (
     <div
      className="h-[350px] rounded-md overflow-hidden"
      key={i}
     >
      <img
       src={image}
       alt={hotel.name}
       className=" w-full h-full object-cover object-top"
      />
     </div>
    ))}
   </div>

   <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
    {hotel.facilities.map((facility) => (
     <div
      className="border border-slate-300 rounded-sm p-3"
      key={facility}
     >
      {facility}
     </div>
    ))}
   </div>

   <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
    <div className="whitespace-pre-line">{hotel.description}</div>
    <div className="h-fit">
     <GuestInfoForm
      pricePerNight={hotel.pricePerNight}
      hotelId={hotel._id}
     />
    </div>
   </div>
  </div>
 );
};

export default DetailsPage;
