// frontend/src/contexts/AuthContext.tsx


import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';


interface AuthContextType {
    user: User | null;
    role: string | null;
    name: string | null;
    imagePath: number | null;
    setImagePath: (n: number) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null, role: null, name: null, imagePath: null, setImagePath: () => {}, loading: true
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [imagePath, setImagePath] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        return onAuthStateChanged(auth, async (currentUser) => {

            if (currentUser) {

                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setRole(data.role ?? 'guest');
                    setName(data.name ?? null);
                    setImagePath(data.image || null);
                    console.log(`ACCESS GRANTED — ${data.name} (${data.role})`);
                } else {
                    // FALLBACK - SHOULD NEVER HAPPEN IDEALLY
                    setRole('guest');
                    setName(null);
                    setImagePath(null);
                    console.log('ACCESS GRANTED AS GUEST (no doc)');
                }

                setUser(currentUser);

            } else {

                console.log('ACCESS DENIED');
                setUser(null);
                setRole(null);
                setName(null);
                setImagePath(null);

            }

            setLoading(false);

        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, name, imagePath, setImagePath, loading }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);