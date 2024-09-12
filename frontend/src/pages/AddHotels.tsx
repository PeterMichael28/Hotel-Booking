import { useMutation } from "react-query";


import * as apiClient from "../api-client";
import { useAppContext } from "../hooks/useAppContext";
import ManageHotelForm from "../components/forms/ManageHotelForm/ManageHotelForm";
import { useNavigate } from "react-router-dom";

const AddHotel = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate()

  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({ message: "Hotel Saved!", type: "SUCCESS" });
      navigate("/my-hotels")
    },
    onError: () => {
      showToast({ message: "Error Saving Hotel", type: "ERROR" });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };

  return <ManageHotelForm onSave={handleSave} isLoading={isLoading} />;
};

export default AddHotel;