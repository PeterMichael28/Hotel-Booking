import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';
import { SearchParams } from '@/api-client';

const useUpdateUrlParams = () => {
 const navigate = useNavigate();
 const location = useLocation();

 const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // This will give 'YYYY-MM-DD'
 };

 const updateUrlParams = useCallback(
  (searchParams: SearchParams) => {
   const urlSearchParams = new URLSearchParams();

   Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null && value !== "0") {
     if (key === 'checkIn' || key === 'checkOut') {
      urlSearchParams.append(key, formatDate(value as string));
     } else if (Array.isArray(value)) {
      value.forEach((item) => urlSearchParams.append(key, item));
     } else {
      urlSearchParams.append(key, value);
     }
    }
   });

   const newSearch = urlSearchParams.toString();
   navigate(
    {
     pathname: location.pathname,
     search: newSearch,
    },
    { replace: true },
   );
  },
  [navigate, location.pathname],
 );

 return updateUrlParams;
};

export default useUpdateUrlParams;
