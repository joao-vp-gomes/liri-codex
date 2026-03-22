// frontend/src/components/UserProtectedRoute/UserProtectedRoute.tsx


import { useAuth } from '../contexts/AuthContext';
import type { JSX } from 'react';
import { canPerform } from '../utils/canPerform';
import type { ActionType } from '../types/actionType';
import UserProtectionBreachPage from '../pages/UserProtectionBreachPage/UserProtectionBreachPage';


export const UserProtectedRoute = ({ children, actions, targetCharacter }: {
    children: JSX.Element,
    actions: ActionType[],
    targetCharacter?: string | null
}) => {

    const { account, loading } = useAuth();

    if (loading) return null;

    if (!canPerform(account?.role ?? 'anon', actions, account?.characters ?? [], targetCharacter ?? null)) 
        return (
            <UserProtectionBreachPage />
        );
    else return children;

};


export default UserProtectedRoute;