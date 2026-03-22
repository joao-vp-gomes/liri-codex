// frontend/src/pages/UserProtectionBreachPage/UserProtectionBreachPage.tsx


import { t } from '../../utils/localizer';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

import styles from './UserProtectionBreachPage.module.css';
import Header from '../../components/Header/Header';


export const UserProtectionBreachPage: React.FC = () => {

    const { language } = useLanguage();
    const navigate = useNavigate();
    
    return(
        <>
            <Header showProfile={true} />
            <div className={styles.protection}>
                    <p>{t({ text: 'user-protection-breach-message', language: language, mode: 'UPPERCASE' })}</p>
                    <button onClick={() => navigate('/home')}>
                        {t({ text: 'back-home', language: language, mode: 'UPPERCASE' })}
                    </button>
            </div>
        </>
    );

}


export default UserProtectionBreachPage;