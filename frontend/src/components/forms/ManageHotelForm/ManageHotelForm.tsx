import { FormProvider, useForm } from 'react-hook-form';
import DetailsSection from './DetailsSection';
import TypeSection from './TypeSection';
import FacilitiesSection from './FacilitiesSection';
import GuestsSection from './GuestsSection';
import ImagesSection from './ImagesSection';
import { useCallback, useEffect, useState } from 'react';
import { HotelType } from '../../../../../backend/src/shared/types';
import { useBlocker, useNavigate } from 'react-router-dom';
import {
 Dialog,
 DialogContent,
 DialogTitle,
} from '../../ui/dialog';
import { Button } from '../../ui/button';

export type HotelFormData = {
 name: string;
 city: string;
 country: string;
 description: string;
 type: string;
 pricePerNight: number;
 starRating: number;
 facilities: string[];
 imageFiles: FileList;
 imageUrls: string[];
 adultCount: number;
 childCount: number;
};

type Props = {
 hotel?: HotelType;
 onSave: (hotelFormData: FormData) => void;
 isLoading: boolean;
};

const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
 const formMethods = useForm<HotelFormData>();
 const { handleSubmit, reset, formState } = formMethods;

 const navigate = useNavigate();

 const [isDialogOpen, setIsDialogOpen] = useState(false);

 useEffect(() => {
  reset(hotel);
 }, [hotel, reset]);

// Determine if navigation should be blocked based on form dirty state
const shouldBlock = useCallback(
    () => formState.isDirty,
    [formState.isDirty],
  );
  
  // Create a blocker using the shouldBlock function
  const blocker = useBlocker(() => shouldBlock());
  
  // Open a dialog when navigation is blocked
  useEffect(() => {
    if (blocker.state === 'blocked') {
      setIsDialogOpen(true);
    }
  }, [blocker]);
  
  // Handle browser's native 'beforeunload' event
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // If shouldBlock returns true, prevent the default action and show a confirmation dialog
      if (shouldBlock() && hotel) {
        event.preventDefault();
        event.returnValue =
          'You have unsaved changes. Are you sure you want to Reload?';
      }
    };
  
    // Add the event listener when the component mounts
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hotel, shouldBlock]);

 const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
  const formData = new FormData();
  if (hotel) {
   formData.append('hotelId', hotel._id);
  }
  formData.append('name', formDataJson.name);
  formData.append('city', formDataJson.city);
  formData.append('country', formDataJson.country);
  formData.append('description', formDataJson.description);
  formData.append('type', formDataJson.type);
  formData.append(
   'pricePerNight',
   formDataJson.pricePerNight.toString(),
  );
  formData.append('starRating', formDataJson.starRating.toString());
  formData.append('adultCount', formDataJson.adultCount.toString());
  formData.append('childCount', formDataJson.childCount.toString());
  formDataJson.facilities.forEach((facility, index) => {
   formData.append(`facilities[${index}]`, facility);
  });

  if (formDataJson.imageUrls) {
   formDataJson.imageUrls.forEach((url, index) => {
    formData.append(`imageUrls[${index}]`, url);
   });
  }

  Array.from(formDataJson.imageFiles).forEach((imageFile) => {
   formData.append(`imageFiles`, imageFile);
  });
  onSave(formData);
 });

 const handleCancel = () => {
  if (formState.isDirty) {
   setIsDialogOpen(true);
  } else {
   navigate(-1);
  }
 };

 const handleConfirm = () => {
  setIsDialogOpen(false);
  if (blocker.state === 'blocked') {
   blocker.proceed();
  } else {
   navigate(-1);
  }
 };

 const handleDialogClose = () => {
  setIsDialogOpen(false);
  if (blocker.state === 'blocked') {
   blocker.reset();
  }
 };
 return (
  <FormProvider {...formMethods}>
   <form
    className="flex flex-col gap-10"
    onSubmit={onSubmit}
   >
    <DetailsSection />
    <TypeSection />
    <FacilitiesSection />
    <GuestsSection />
    <ImagesSection />
    <div className="flex justify-end items-center gap-3">
     {hotel && (
      <button
       onClick={handleCancel}
       type="button"
       className="border-blue-600 text-blue-600 w-[120px] px-4 py-3 font-semibold rounded-md   bg-white hover:border-blue-500 transition-all duration-300  hover:bg-blue-500  border"
      >
       Cancel
      </button>
     )}

     <button
      disabled={isLoading}
      type="submit"
      className="bg-blue-600 text-white px-4 w-[120px] py-3 font-semibold rounded-md   hover:bg-blue-500 transition-all duration-300  disabled:bg-gray-500"
     >
      {isLoading ? 'Saving...' : 'Save'}
     </button>
    </div>
   </form>

   <Dialog
    open={isDialogOpen}
    onOpenChange={handleDialogClose}
   >
    <DialogContent aria-describedby="You have unsaved changes. Are you sure you want to leave?">
     <DialogTitle>Unsaved Changes</DialogTitle>
     {/* <DialogDescription>You have unsaved changes. Are you sure you want to leave?</DialogDescription> */}
     <p>You have unsaved changes. Are you sure you want to leave?</p>
     {/* <DialogActions> */}
     <div className="flex justify-end items-center gap-4">
      <Button onClick={handleDialogClose}>Stay</Button>
      <Button
       onClick={handleConfirm}
       variant={'destructive'}
      >
       Leave
      </Button>
     </div>
     {/* </DialogActions> */}
    </DialogContent>
   </Dialog>
  </FormProvider>
 );
};
export default ManageHotelForm;
