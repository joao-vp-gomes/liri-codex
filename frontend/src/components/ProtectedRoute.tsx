// frontend/src/components/ProtectedRoute.tsx


import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { JSX } from 'react';


export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {

    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/signin" replace />;
    else return children;

};


export default ProtectedRoute;