// frontend/src/components/HomePageButtons/CodexButton.tsx


import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../utils/localizer';
import styles from '../../pages/HomePage/HomePage.module.css';


const CodexButton: React.FC = () => {

    const { language } = useLanguage();

    const handleClick = () => {
        let a;
    };

    return (
        <button className={styles.smallButton} onClick={handleClick}>
            {t({ text: 'codex', language, mode: 'UPPERCASE' })}
        </button>
    );

};


export default CodexButton;