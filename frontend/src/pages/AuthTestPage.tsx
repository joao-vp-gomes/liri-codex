// frontend/src/pages/AuthTestPage.tsx

/*

TEMPORARY PAGE FOR DEBUG!!!

*/


import React from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import Header from '../components/Header/Header.tsx';

const AuthTestPage: React.FC = () => {

    const { name, imagePath, role } = useAuth();

    return (
        <div>
            <Header showProfile={true} />
            <div>
                <div>
                    <div>User Info</div>
                    <div>
                        <span>Name</span>
                        <span>{name ?? '—'}</span>
                    </div>
                    <div>
                        <span>Image Path</span>
                        <span>{imagePath ?? '—'}</span>
                    </div>
                    <div>
                        <span>Role</span>
                        <span>{role ?? '—'}</span>
                    </div>
                </div>
            </div>
        </div>
    );

};


export default AuthTestPage;