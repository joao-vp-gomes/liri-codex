// frontend/src/components/ProtectedRoute.tsx


import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { JSX } from 'react';


export const AuthProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return null;
    if (!user) return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
    return children;
};


export default AuthProtectedRoute;