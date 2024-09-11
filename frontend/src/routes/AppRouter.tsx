import {
 createBrowserRouter,
 Navigate,
 RouterProvider,
} from 'react-router-dom';
import Layout from '@/layouts/Layout';
import ErrorElement from './ErrorElement/ErrorElement';
import Register from '@/pages/Register';
import SignIn from '@/pages/SignIn';
import ProtectedRoutes from './ProtectedRoutes';
import AddHotel from '@/pages/AddHotels';
import EditHotel from '@/pages/EditHotel';
import MyHotels from '@/pages/MyHotels';
import Search from '@/pages/Search';

export default function AppRouter() {
 // Use different layout to display error depending on authentication status
 const ErrorDisplay = () => {
  return (
   <Layout withOutlet={false}>
    <ErrorElement />
   </Layout>
  );
 };

 // ================= ROUTES ======================= //
 const router = createBrowserRouter([
  {
   element: <Layout withOutlet={true} />,
   children: [
    { path: '/', element: <p>Home Page</p> },
    { path: '/search', element: <Search /> },
    { path: '/register', element: <Register /> },
    { path: '/sign-in', element: <SignIn /> },
    {
     element: <ProtectedRoutes />,
     children: [
      { path: '/add-hotel', element: <AddHotel /> },
      { path: '/edit-hotel/:hotelId', element: <EditHotel /> },
      { path: '/my-hotels', element: <MyHotels /> },
     ],
    },
    { path: '*', element: <Navigate to="/" /> },
   ],
   errorElement: <ErrorDisplay />,
  },
 ]);

 return <RouterProvider router={router} />;
}
