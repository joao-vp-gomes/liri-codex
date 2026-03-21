// frontend/src/pages/ModerationPage/ModerationPage.tsx


import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../utils/localizer';
import Header from '../../components/Header/Header';
import Archive from '../../services/database';
import styles from './ModerationPage.module.css';

import INCOGNITO_SOURCE from '../../assets/profile-icon-0.jpg';
import PROFILE_ICON_1   from '../../assets/profile-icon-1.png';
import PROFILE_ICON_2   from '../../assets/profile-icon-2.png';
import PROFILE_ICON_3   from '../../assets/profile-icon-3.png';


const PROFILE_ICONS = [INCOGNITO_SOURCE, PROFILE_ICON_1, PROFILE_ICON_2, PROFILE_ICON_3];

interface UserDoc {
    uid: string;
    name?: string;
    role?: string;
    image?: number;
    characters?: string[];
}

const resolveImage = (image?: number) => PROFILE_ICONS[image ?? 0] ?? INCOGNITO_SOURCE;


const MemberCard: React.FC<{ user: UserDoc }> = ({ user }) => {

    const { language } = useLanguage();
    const isEmpty = !user.name && !user.role;

    const [expanded, setExpanded]       = useState(false);
    const [editName, setEditName]       = useState(user.name ?? '');
    const [editImage, setEditImage]     = useState(user.image ?? 1);
    const [charNames, setCharNames]     = useState<Record<string, string>>({});
    const [saving, setSaving]           = useState(false);
    const [status, setStatus]           = useState<string | null>(null);
    const [pendingDelete, setPendingDelete] = useState(false);

    useEffect(() => {
        if (!expanded || !user.characters?.length) return;
        const fetch = async () => {
            const results: Record<string, string> = {};
            for (const key of user.characters!) {
                const entry = await Archive.fetch(key);
                results[key] = entry?.['name'] ?? key;
            }
            setCharNames(results);
        };
        fetch();
    }, [expanded]);

    const handleSave = async () => {
        setSaving(true); setStatus(null);
        try {
            await updateDoc(doc(db, 'users', user.uid), { name: editName, image: editImage });
            setStatus('saved');
        } catch { setStatus('error'); }
        setSaving(false);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const next = !pendingDelete;
        setPendingDelete(next);
        await updateDoc(doc(db, 'users', user.uid), { deleted: next });
    };

    return (
        <div
            className={`${styles.card} ${expanded ? styles.cardExpanded : ''} ${isEmpty ? styles.cardEmpty : ''} ${pendingDelete ? styles.cardPendingDelete : ''}`}
            onClick={() => !expanded && setExpanded(true)}
        >
            {!expanded ? (
                <div className={styles.cardCollapsed}>
                    <img className={styles.cardIcon} src={resolveImage(user.image)} alt="" />
                    <span className={styles.cardName}>
                        {isEmpty
                            ? t({ text: 'new-member', language, mode: 'UPPERCASE' })
                            : (user.name ?? '—').toUpperCase()
                        }
                    </span>
                </div>
            ) : (
                <div className={styles.cardBody} onClick={e => e.stopPropagation()}>
                    <button className={styles.cardClose} onClick={() => setExpanded(false)}>-</button>

                    <div className={styles.cardUid}>{user.uid}</div>

                    <div className={styles.cardIconPicker}>
                        {[1, 2, 3].map(n => (
                            <button
                                key={n}
                                className={`${styles.iconBtn}${editImage === n ? ` ${styles.iconBtnActive}` : ''}`}
                                onClick={() => setEditImage(n)}
                            >
                                <img src={PROFILE_ICONS[n]} alt={`icon ${n}`} />
                            </button>
                        ))}
                    </div>

                    <div className={styles.cardField}>
                        <span className={styles.cardFieldLabel}>{t({ text: 'name', language, mode: 'UPPERCASE' })}</span>
                        <input
                            className={styles.cardInput}
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                        />
                    </div>

                    {user.characters?.length ? (
                        <div className={styles.cardField}>
                            <span className={styles.cardFieldLabel}>{t({ text: 'characters', language, mode: 'UPPERCASE' })}</span>
                            <div className={styles.charList}>
                                {user.characters.map(key => (
                                    <div key={key} className={styles.charItem}>
                                        <span className={styles.charKey}>{key}</span>
                                        <span className={styles.charName}>{charNames[key] ?? '…'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className={styles.cardActions}>
                        <button className={styles.btnSave} onClick={handleSave} disabled={saving}>
                            {saving ? '…' : t({ text: 'save', language, mode: 'UPPERCASE' })}
                        </button>
                        {status === 'saved' && <span className={styles.statusOk}>✓</span>}
                        {status === 'error' && <span className={styles.statusErr}>✕</span>}
                        <button className={pendingDelete ? styles.btnCancelDelete : styles.btnDelete} onClick={handleDelete}>
                            {t({ text: pendingDelete ? 'cancel' : 'delete', language, mode: 'UPPERCASE' })}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const GuestCard: React.FC<{ user: UserDoc }> = ({ user }) => {

    const { language } = useLanguage();
    const [expanded, setExpanded]           = useState(false);
    const [pendingDelete, setPendingDelete] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const next = !pendingDelete;
        setPendingDelete(next);
        await updateDoc(doc(db, 'users', user.uid), { deleted: next });
    };

    return (
        <div
            className={`${styles.card} ${expanded ? styles.cardExpanded : ''} ${pendingDelete ? styles.cardPendingDelete : ''}`}
            onClick={() => !expanded && setExpanded(true)}
        >
            {!expanded ? (
                <div className={styles.cardCollapsed}>
                    <img className={styles.cardIcon} src={INCOGNITO_SOURCE} alt="" />
                    <span className={styles.cardName}>{(user.name ?? '—').toUpperCase()}</span>
                </div>
            ) : (
                <div className={styles.cardBody} onClick={e => e.stopPropagation()}>
                    <button className={styles.cardClose} onClick={() => setExpanded(false)}>-</button>
                    <div className={styles.cardUid}>{user.uid}</div>
                    <div className={styles.cardName}>{(user.name ?? '—').toUpperCase()}</div>
                    <div className={styles.cardActions}>
                        <button className={pendingDelete ? styles.btnCancelDelete : styles.btnDelete} onClick={handleDelete}>
                            {t({ text: pendingDelete ? 'cancel' : 'delete', language, mode: 'UPPERCASE' })}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const ModerationPage: React.FC = () => {

    const { language } = useLanguage();
    const [members, setMembers] = useState<UserDoc[]>([]);
    const [guests, setGuests]   = useState<UserDoc[]>([]);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'users'), (snap) => {
            const ms: UserDoc[] = [];
            const gs: UserDoc[] = [];
            const fixes: Promise<void>[] = [];

            snap.docs.forEach(d => {
                const data = d.data();
                if (data.deleted) return;

                const entry = { uid: d.id, ...data } as UserDoc;

                if (!data.role) {
                    fixes.push(updateDoc(doc(db, 'users', d.id), { role: 'member' }));
                    ms.push({ ...entry, role: 'member' });
                } else if (data.role === 'guest') {
                    gs.push(entry);
                } else {
                    ms.push(entry);
                }
            });

            Promise.all(fixes);
            setMembers(ms);
            setGuests(gs);
        });
        return () => unsub();
    }, []);

    return (
        <>
            <Header showProfile={true} />
            <div className={styles.page}>

                <div className={styles.section}>
                    <div className={styles.sectionTitle}>
                        {t({ text: 'members', language, mode: 'UPPERCASE' })}
                    </div>
                    <div className={styles.cardList}>
                        {members.map(u => <MemberCard key={u.uid} user={u} />)}
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.sectionTitle}>
                        {t({ text: 'guests', language, mode: 'UPPERCASE' })}
                    </div>
                    <div className={styles.cardList}>
                        {guests.length === 0
                            ? <div className={styles.empty}>{t({ text: 'no-guests', language, mode: 'PLAIN_FIRST_UPPER' })}</div>
                            : guests.map(u => <GuestCard key={u.uid} user={u} />)
                        }
                    </div>
                </div>

            </div>
        </>
    );

};

export default ModerationPage;