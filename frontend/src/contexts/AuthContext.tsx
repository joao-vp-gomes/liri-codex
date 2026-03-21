// frontend/src/contexts/AuthContext.tsx


import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, deleteUser, type User } from 'firebase/auth';
import { doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import type { RoleType } from '../types/roleType';


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

    const [user, setUser]             = useState<User | null>(null);
    const [role, setRole]             = useState<RoleType>('guest');
    const [name, setName]             = useState<string>('');
    const [characters, setCharacters] = useState<string[]>([]);
    const [imagePath, setImagePath]   = useState<number>(0);
    const [loading, setLoading]       = useState<boolean>(true);

    useEffect(() => {

        let unsubscribeSnapshot: (() => void) | null = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {

            if (unsubscribeSnapshot) { unsubscribeSnapshot(); unsubscribeSnapshot = null; }

            if (currentUser) {

                setUser(currentUser);

                unsubscribeSnapshot = onSnapshot(doc(db, 'users', currentUser.uid), async (snap) => {

                    if (snap.exists()) {

                        const data = snap.data();

                        if (data.deleted === true) {
                            await deleteUser(currentUser);
                            await deleteDoc(doc(db, 'users', currentUser.uid));
                            return;
                        }

                        setRole(data.role ?? 'guest');
                        setName(data.name ?? '');
                        setImagePath(data.image || 0);
                        setCharacters([...data.characters]);
                        console.log(`ACCESS GRANTED — ${data.name} (${data.role})`);

                    } else {
                        setRole('guest');
                        setName('');
                        setImagePath(0);
                        setCharacters([]);
                        console.log('ACCESS GRANTED AS GUEST (no doc)');
                    }

                    setLoading(false);

                });

            } else {

                console.log('ACCESS DENIED');
                setUser(null);
                setRole('guest');
                setName('');
                setCharacters([]);
                setImagePath(0);
                setLoading(false);

            }

        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeSnapshot) unsubscribeSnapshot();
        };

    }, []);

    return (
        <AuthContext.Provider value={{ user, role, name, characters, imagePath, setImagePath, loading }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);