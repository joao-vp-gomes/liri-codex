// frontend/src/components/HomePageButtons/CharactersButton.tsx


import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../utils/localizer';
import styles from '../../pages/HomePage/HomePage.module.css';


const MOCK_CHARACTERS: { key: string, name: string }[] = [
    { key: '1', name: 'Ugrim' },
    { key: '2', name: 'Nocthaa' },
];


const CharacterButton: React.FC = () => {

    const { language } = useLanguage();

    const options: ({ key: string, name: string } | 'new')[] = [
        ...MOCK_CHARACTERS,
        ...(MOCK_CHARACTERS.length < 3 ? ['new' as const] : []),
    ];

    const [index, setIndex] = useState(0);
    const current = options[Math.min(index, options.length - 1)];
    const isNew = current === 'new';

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIndex(i => (i - 1 + options.length) % options.length);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIndex(i => (i + 1) % options.length);
    };

    const doNothing = () => {}
    const handleClick = () => {
        doNothing();
    };

    return (
        <div className={styles.arrowedButtonContainer}>
            {options.length > 1 && (<div className={styles.arrow} onClick={handlePrev}>‹</div>)}

            <button className={styles.largeButton} onClick={handleClick}>
                {isNew
                    ? <span>{t({ text: 'new-character', language, mode: 'UPPERCASE' })}</span>
                    : <span>{(current as { key: string, name: string }).name.toUpperCase()}</span>
                }
            </button>

            {options.length > 1 && (<div className={styles.arrow} onClick={handleNext}>›</div>)}
        </div>
    );

};


export default CharacterButton;