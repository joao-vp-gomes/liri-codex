// frontend/src/components/HomePageButtons/CampaignButton.tsx


import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../utils/localizer';
import styles from '../../pages/HomePage/HomePage.module.css';


const CampaignButton: React.FC = () => {

    const { language } = useLanguage();

    const handleClick = () => {
        let a;
    };

    return (
        <button className={styles.smallButton} onClick={handleClick}>
            {t({ text: 'campaign', language, mode: 'UPPERCASE' })}
        </button>
    );

};


export default CampaignButton;