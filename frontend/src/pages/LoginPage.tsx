// frontend/src/pages/LoginPage.tsx

import React, { useEffect, useState } from 'react';
import { signInAnonymously, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { user } = useAuth();

    useEffect(() => {
        if (user) console.log(0) // TODO: JOGAR PARA A HOME
    }, [user]);
    
    const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            alert("ACCESS DENIED");
        }
    };

    const handleGuestLogin = async () => {
        try {
            await signInAnonymously(auth);
        } catch (error) {
            alert("ERROR");
        }
    };

    return (

        <div className="loginContainer">

            <h1>Liri</h1>

            <form onSubmit={e => handleLogin(e)}>
                <input 
                    className="emailInput"
                    type="email" placeholder="Email" required 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    className="passwordInput"
                    type="password" placeholder="Password" required 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button type="submit">Log in</button>
            </form>
            
            <div className="guestButton">
                <button onClick={() => handleGuestLogin()}>Join as Guest</button>
            </div>

        </div>
    );
};

export default LoginPage;