// frontend/src/contexts/AuthContext.tsx


import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import type { RoleType } from '../types/RoleType';


interface AuthContextType {
    user: User | null;
    role: RoleType;
    name: string;
    imagePath: number;
    characters: string[];
    setImagePath: (n: number) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null, role: 'guest', name: '', characters: [], imagePath: 0, setImagePath: () => {}, loading: true
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<RoleType>('guest');
    const [name, setName] = useState<string>('');
    const [characters, setCharacters] = useState<string[]>([]);
    const [imagePath, setImagePath] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        return onAuthStateChanged(auth, async (currentUser) => {

            if (currentUser) {

                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setRole(data.role ?? 'guest');
                    setName(data.name ?? null);
                    setImagePath(data.image || 0);
                    setCharacters([...data.characters])
                    console.log(`ACCESS GRANTED — ${data.name} (${data.role})`);
                } else {
                    // FALLBACK - SHOULD NEVER HAPPEN IDEALLY
                    setRole('guest');
                    setName('');
                    setImagePath(0);
                    setCharacters([])
                    console.log('ACCESS GRANTED AS GUEST (no doc)');
                }

                setUser(currentUser);

            } else {

                console.log('ACCESS DENIED');
                setUser(null);
                setRole('guest');
                setName('');
                setCharacters([]);
                setImagePath(0);

            }

            setLoading(false);

        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, name, characters, imagePath, setImagePath, loading }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);