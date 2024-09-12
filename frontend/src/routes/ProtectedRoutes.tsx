import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';

const ProtectedRoutes = () => {
 const { isLoggedIn } = useAppContext();
 if (isLoggedIn) return <Outlet />;
 else return <Navigate to="/sign-in"/>;
};

export default ProtectedRoutes;
