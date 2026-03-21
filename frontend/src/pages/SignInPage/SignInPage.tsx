// frontend/src/pages/SignInPage/SignInPage.tsx


import LOGO_FULL_SOURCE from '../../assets/logo-full.png';
import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInAnonymously, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../../services/firebase';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../utils/localizer';
import GUEST_NAMES from '../../data/guest-names.json';

import Header from '../../components/Header/Header';
import styles from './SignInPage.module.css';


const SignInPage: React.FC = () => {

    const navigate = useNavigate();
    const { language } = useLanguage();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState<string | null>(null);
    const [loading, setLoading]   = useState<string | null>(null);

    const location = useLocation();
    const from = (location.state as { from?: string })?.from ?? '/home';

    const handleSignIn = async (e: React.FormEvent) => {

        e.preventDefault();
        setError(null);
        setLoading('user');
        try {
            const credential = await signInWithEmailAndPassword(auth, username + '@liri.com', password);
            const userDoc = await getDoc(doc(db, 'users', credential.user.uid));
            if (!userDoc.exists() || !userDoc.data()?.name) {
                await signOut(auth);
                setError('invalid-credentials');
            } else {
                navigate(from, { replace: true });
            }
        } catch { setError('invalid-credentials'); }
        setLoading(null);

    };

    const handleGuest = async () => {

        setError(null);
        setLoading('guest');
        try {
            const credential = await signInAnonymously(auth);
            const uid = credential.user.uid;
            const guestName = GUEST_NAMES.list[Math.floor(Math.random() * GUEST_NAMES.list.length)];
            await setDoc(doc(db, 'users', uid), {
                name: guestName,
                role: 'guest',
                image: 0,
                characters: [],
                deleted: false
            });
            navigate(from, { replace: true });
        } catch { setError('guest-sign-in-error'); }
        setLoading(null);

    };

    return (
        <>
            <Header showProfile={false} />
            <div className={styles.page}>
                <div className={styles.center}>
                    <form className={styles.form} onSubmit={handleSignIn}>

                        <div className={styles.logoFull}>
                            <img src={LOGO_FULL_SOURCE} alt="Liri" />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                {t({text: 'username', language: language, mode: 'UPPERCASE'})}
                            </label>
                            <input
                                className={styles.input}
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                {t({text: 'password', language: language, mode: 'UPPERCASE'})}
                            </label>
                            <input
                                className={styles.input}
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <div className={styles.error}>{t({text: error, language: language, mode: 'PLAIN_FIRST_UPPER'})}</div>}

                        <div className={styles.actions}>
                            <button className={styles.buttonPrimary} type="submit" disabled={!!loading}>
                                {loading === 'user'
                                    ? t({text: 'signing-in', language: language, mode: 'UPPERCASE'})
                                    : t({text: 'sign-in', language: language, mode: 'UPPERCASE'})
                                }
                            </button>
                            <button className={styles.buttonSecondary} type="button" onClick={handleGuest} disabled={!!loading}>
                                {loading === 'guest'
                                    ? t({text: 'entering-as-guest', language: language, mode: 'UPPERCASE'})
                                    : t({text: 'enter-as-guest', language: language, mode: 'UPPERCASE'})
                                }
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );

};


export default SignInPage;