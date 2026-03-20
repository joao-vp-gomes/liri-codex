// frontend/src/components/ProtectedRoute.tsx


import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { JSX } from 'react';
import { canPerform } from '../utils/canPerform';
import type { ActionType } from '../types/actionType';


type ARGS_userProtectedRoute = {
    actions: ActionType[],
    targetCharacter?: string | null
}
export const UserProtectedRoute = ({ children, actions, targetCharacter }: { children: JSX.Element } & ARGS_userProtectedRoute) => {

    const { role, characters, loading } = useAuth();
    const navigate = useNavigate();
    const handleClick = () => {
       
        navigate('/home');   

    }

    if (loading) return <div>Loading...</div>;
    if(!canPerform({role: role, userCharacters: characters, actions: [...actions], targetCharacter: targetCharacter ?? null})) return (
        <>
            <div>
                Wrong place bud
                <button onClick={handleClick} >Go Home</button>
            </div>
        </>
    );
    return children;

};


export default UserProtectedRoute;