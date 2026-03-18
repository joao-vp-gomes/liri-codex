// frontend/src/components/Header/Header.tsx


import LOGO_SOURCE from '../../assets/logo.png';
import INCOGNITO_SOURCE from '../../assets/profile-icon-0.jpg';
import PROFILE_ICON_1 from '../../assets/profile-icon-1.png';
import PROFILE_ICON_2 from '../../assets/profile-icon-2.png';
import PROFILE_ICON_3 from '../../assets/profile-icon-3.png';

import React, { useState, useRef, useEffect } from 'react';
import { signOut, deleteUser } from 'firebase/auth';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../contexts/LanguageContext';
import styles from './Header.module.css';
import { t, format } from '../../utils/localizer';
import { useNavigate } from 'react-router-dom';


const PROFILE_ICONS = [
    PROFILE_ICON_1,
    PROFILE_ICON_2,
    PROFILE_ICON_3,
];

interface Props {
    showProfile?: boolean;
}

const Header: React.FC<Props> = ({ showProfile = false }) => {

    const navigate = useNavigate();

    const { name, role, imagePath, setImagePath } = useAuth();
    const { language, setLanguage } = useLanguage();

    const [menuOpen, setMenuOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const langRef = useRef<HTMLDivElement>(null);

    const isGuest = imagePath === null;
    const image = isGuest
        ? INCOGNITO_SOURCE
        : PROFILE_ICONS[(imagePath - 1)] ?? PROFILE_ICON_1;

    useEffect(() => {

        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
            if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
        
    }, []);

    const handleDisconnect = async () => {

        const user = auth.currentUser;
        if (!user) return;

        setMenuOpen(false);
        if (isGuest) {
            await deleteDoc(doc(db, 'users', user.uid));
            await deleteUser(user);
        } else {
            await signOut(auth);
        }

    };

    const handleIconSelect = async (iconNumber: number) => {

        setImagePath(iconNumber);

        const user = auth.currentUser;
        if (!user) return;

        await updateDoc(doc(db, 'users', user.uid), { image: iconNumber });
        setImagePath(iconNumber);

    };

    const handleLogoClick = () => {

        navigate('/home');

    };

    const languageDropdown = (
        <div className={styles.langContainer} ref={langRef}>
            <button className={styles.langBtn} onClick={() => setLangOpen(o => !o)}>
                {language.toUpperCase()}
                <span className={styles.langCaret}>▾</span>
            </button>
            {langOpen && (
                <div className={styles.floatingMenu}>
                    {SUPPORTED_LANGUAGES.map(lang => (
                        <button
                            key={lang}
                            className={`${styles.floatingMenuItem}${lang === language ? ` ${styles.floatingMenuItemActive}` : ''}`}
                            onClick={() => { setLanguage(lang); setLangOpen(false); }}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    const profileContainer = (
        <div className={styles.profileContainer} ref={menuRef}>
            <span className={styles.profileName}>
                {format({text: name ?? 'guest', mode: 'UPPERCASE'}) + (role === 'guest' ? ` (${t({text: 'guest', language: language, mode: 'UPPERCASE'})})` : '')}
            </span>
            <div className={styles.profileImageWrapper} onClick={() => setMenuOpen(o => !o)}>
                <img
                    className={styles.profileImage}
                    src={image}
                    alt={format({text: name ?? 'guest', mode: 'UPPERCASE'}) + (role === 'guest' ? ` (${t({text: 'guest', language: language, mode: 'UPPERCASE'})})` : '')}
                />
            </div>
            {menuOpen && (
                <div className={styles.floatingMenu}>
                    {!isGuest && (
                        <>
                            <div className={styles.iconPickerRow}>
                                {PROFILE_ICONS.map((src, i) => (
                                    <button
                                        key={i}
                                        className={`${styles.iconPickerBtn}${imagePath === i + 1 ? ` ${styles.iconPickerBtnActive}` : ''}`}
                                        onClick={() => handleIconSelect(i + 1)}
                                    >
                                        <img src={src} alt={`icon ${i + 1}`} />
                                    </button>
                                ))}
                            </div>
                            <div className={styles.floatingMenuDivider} />
                        </>
                    )}
                    <button className={styles.floatingMenuItem} onClick={handleDisconnect}>
                        {t({text: isGuest ? 'sign-in' : 'disconnect', language: language, mode: 'UPPERCASE'})}
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <img src={LOGO_SOURCE} alt="Liri" onClick={handleLogoClick} />
            </div>
            <div className={styles.rightSection}>
                {showProfile && profileContainer}
                {languageDropdown}
            </div>
        </header>
    );

};


export default Header;