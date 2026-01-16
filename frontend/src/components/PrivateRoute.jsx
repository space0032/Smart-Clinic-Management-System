import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    // Check if user is logged in via localStorage
    const user = localStorage.getItem('clinicUser');

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
