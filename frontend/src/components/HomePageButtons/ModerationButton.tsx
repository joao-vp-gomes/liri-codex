// frontend/src/components/HomePageButtons/ModerationButton.tsx


import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../utils/localizer';
import styles from '../../pages/HomePage/HomePage.module.css';
import { useNavigate } from 'react-router-dom';


const ModerationButton: React.FC = () => {

    const { language } = useLanguage();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/moderation')
    };

    return (
        <button className={styles.smallButton} onClick={handleClick}>
            {t({ text: 'moderation', language, mode: 'UPPERCASE' })}
        </button>
    );

};


export default ModerationButton;