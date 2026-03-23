// frontend/src/components/UserProtectedRoute/UserProtectedRoute.tsx


import { useAuth } from '../contexts/AuthContext';
import type { JSX } from 'react';
import UserProtectionBreachPage from '../pages/UserProtectionBreachPage/UserProtectionBreachPage';


export const UserProtectedRoute = ({ children, validation }: {
    children: JSX.Element,
    validation: boolean
}) => {

    const { loading } = useAuth();

    if (loading) return null;
    
    if (!validation) return <UserProtectionBreachPage />
        
    else return children;

};


export default UserProtectedRoute;