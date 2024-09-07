import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as apiClient from '../api-client';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { BiLoader } from 'react-icons/bi';

export type SignInFormData = {
 email: string;
 password: string;
};

const SignIn = () => {
 const { showToast } = useAppContext();
 const navigate = useNavigate();
 const queryClient = useQueryClient();

 const {
  register,
  formState: { errors },
  handleSubmit,
 } = useForm<SignInFormData>();

 const mutation = useMutation(apiClient.signIn, {
  onSuccess: async () => {
   showToast({ message: 'Sign in Successful!', type: 'SUCCESS' });
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
    <h2 className="text-3xl font-bold">Sign In</h2>
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
    <span className="flex items-center justify-between">
     <button
      type="submit"
      disabled={mutation.isLoading}
      className="bg-blue-600 text-white px-9 py-3 font-semibold hover:bg-blue-500 rounded-md disabled:bg-blue-400"
     >
         {mutation.isLoading ? <span className='flex items-center gap-2'>Login In <BiLoader className='text-sm animate-spin' /></span> : "Login"}
     </button>
    </span>
   </form>
   <div className="w-full mt-2 text-sm text-black">
    Don't have an account?{' '}
    <Link
     to="/register"
     className="text-blue-300 cursor-pointer"
    >
     Register
    </Link>
   </div>
  </div>
 );
};

export default SignIn;
