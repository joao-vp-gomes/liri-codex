// frontend/src/contexts/AuthContext.tsx

/*

Hook de contexto que lida com autenticacao para a firebase.

*/

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

interface AuthContextType {
    user: User | null;
    role: string | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, role: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, async (currentUser) => {

            if (currentUser) {

                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                const role = userDoc.exists() ? userDoc.data().role : 'guest';
                
                if (userDoc.exists())
                    console.log(
                        `
                            ACCESS GRANTED
                            UID: ${currentUser.uid}
                            NAME: ${userDoc.data().name}
                            ROLE: ${role}
                        `
                    );
                else console.log("ACCESS GRANTED AS GUEST");
                
                setUser(currentUser);
                setRole(role);
            } else {
                console.log("ACCESS DENIED");
                setUser(null);
                setRole(null);
            }

            setLoading(false);

        });

    }, []);

    return (
        <AuthContext.Provider value={{ user, role, loading }}>
        {children}
        </AuthContext.Provider>
    );
    
};

export const useAuth = () => useContext(AuthContext);