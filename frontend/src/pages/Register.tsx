import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import * as apiClient from '../api-client';
import { useAppContext } from '../hooks/useAppContext';
import { BiLoader } from 'react-icons/bi';

export type RegisterFormData = {
 firstName: string;
 lastName: string;
 email: string;
 password: string;
 confirmPassword: string;
};

const Register = () => {
 const queryClient = useQueryClient();
 const navigate = useNavigate();
 const { showToast } = useAppContext();

 const {
  register,
  watch,
  handleSubmit,
  formState: { errors },
 } = useForm<RegisterFormData>();

 const mutation = useMutation(apiClient.register, {
  onSuccess: async () => {
   showToast({ message: 'Registration Success!', type: 'SUCCESS' });
   await queryClient.invalidateQueries('validateToken');
   navigate('/');
  },
  onError: (error: Error) => {
   showToast({ message: error.message, type: 'ERROR' });
  },
 });

 const onSubmit = handleSubmit((data) => {
  mutation.mutate(data);
 });

 return (
  <div className="w-full max-w-[700px] mx-auto">
   <form
    className="flex flex-col gap-5 w-full"
    onSubmit={onSubmit}
   >
    <h2 className="text-3xl font-bold">Create an Account</h2>

    <div className="flex flex-col md:flex-row gap-5">
     <label className="text-gray-700 text-sm font-bold flex-1">
      First Name
      <input
       className="border rounded w-full h-10 flex items-center my-1 px-2 font-normal"
       {...register('firstName', {
        required: 'This field is required',
       })}
      />
      {errors.firstName && (
       <span className="text-red-500">
        {errors.firstName.message}
       </span>
      )}
     </label>

     <label className="text-gray-700 text-sm font-bold flex-1">
      Last Name
      <input
       className="border rounded w-full h-10 flex items-center my-1 px-2 font-normal"
       {...register('lastName', {
        required: 'This field is required',
       })}
      ></input>
      {errors.lastName && (
       <span className="text-red-500">{errors.lastName.message}</span>
      )}
     </label>
    </div>
    <label className="text-gray-700 text-sm font-bold flex-1">
     Email
     <input
      type="email"
      className="border rounded w-full h-10 flex items-center my-1 px-2 font-normal"
      {...register('email', { required: 'This field is required' })}
     ></input>
     {errors.email && (
      <span className="text-red-500">{errors.email.message}</span>
     )}
    </label>
    <label className="text-gray-700 text-sm font-bold flex-1">
     Password
     <input
      type="password"
      className="border rounded w-full h-10 flex items-center my-1 px-2 font-normal"
      {...register('password', {
       required: 'This field is required',
       minLength: {
        value: 6,
        message: 'Password must be at least 6 characters',
       },
      })}
     ></input>
     {errors.password && (
      <span className="text-red-500">{errors.password.message}</span>
     )}
    </label>
    <label className="text-gray-700 text-sm font-bold flex-1">
     Confirm Password
     <input
      type="password"
      className="border rounded w-full h-10 flex items-center my-1 px-2 font-normal"
      {...register('confirmPassword', {
       validate: (val) => {
        if (!val) {
         return 'This field is required';
        } else if (watch('password') !== val) {
         return 'Your passwords do no match';
        }
       },
      })}
     ></input>
     {errors.confirmPassword && (
      <span className="text-red-500">
       {errors.confirmPassword.message}
      </span>
     )}
    </label>
    <span>
     <button
      type="submit"
      disabled={mutation.isLoading}
      className="bg-blue-600 text-white px-4 py-3 disabled:bg-blue-400 rounded-md  font-semibold   hover:bg-blue-500 "
     >
      {mutation.isLoading ? <span className='flex items-center gap-2'>Creating <BiLoader className='text-sm animate-spin' /></span> : "Create Account"}
     </button>
    </span>
   </form>
   <div className="w-full mt-2 text-sm text-black">
    Already have an account?{' '}
    <Link to="/sign-in" className="text-blue-300 cursor-pointer">Login</Link>
   </div>
  </div>
 );
};

export default Register;
