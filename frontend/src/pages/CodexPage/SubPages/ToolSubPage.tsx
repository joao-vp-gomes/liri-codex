// frontend/src/pages/CodexPage/SubPages/ToolSubPage.tsx


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { format, t } from '../../../utils/localizer';
import { register, deregister } from '../../../services/database';
import { Tool, TOOL_KINDS } from '../../../../../shared/entry/tool';
import type { EntryCategory } from '../../../../../shared/entry/entry';
import FloatingSearch from '../../../components/FloatingSearch/FloatingSearch';
import { getImageUrl, useImageUpload } from '../../../services/useImageUpload';
import { ALL_CATEGORIES, AUTOSAVE_DELAY } from '../CodexPage';

import styles from './SubPage.module.css';


interface Props {
    tool: Tool;
    customization: boolean;
    isNew: boolean;
    onCategoryChange: (cat: EntryCategory) => void;
    onSaved: () => void;
    onDeleted: () => void;
}

const ToolSubPage: React.FC<Props> = ({tool: initialTool, customization, isNew, onCategoryChange, onSaved, onDeleted }) => {

    const { language } = useLanguage();
    const { uploading, triggerUpload, deleteImage } = useImageUpload();

    const [tool, setTool] = useState<Tool>(() => new Tool(initialTool));
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [pendingDelete, setPendingDelete] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [kindOpen, setKindOpen] = useState(false);
    const [compositionSearch, setCompositionSearch] = useState(false);
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [tempTag, setTempTag] = useState('');

    const autosaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isDirtyRef = useRef(false);
    const isFirstRender = useRef(true);
    const categoryRef = useRef<HTMLDivElement>(null);
    const kindRef = useRef<HTMLDivElement>(null);

    // SNAPSHOT: ----------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return; }
        if (isDirtyRef.current) return;
        setTool(new Tool(initialTool));
        setSaveStatus('idle');
        setPendingDelete(false);
    }, [initialTool]);

    // DROPDOWN HIDE ON OUTSIDE CLICK: ------------------------------------------------------------------------------------------
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setCategoryOpen(false);
            if (kindRef.current && !kindRef.current.contains(e.target as Node)) setKindOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // UTILS: --------------------------------------------------------------------------------------------------------------------

    const scheduleAutosave = useCallback((updated: Tool) => {
        if (!customization || isNew) return;
        if (autosaveRef.current) clearTimeout(autosaveRef.current);
        isDirtyRef.current = true;
        setSaveStatus('saving');
        autosaveRef.current = setTimeout(async () => {
            const ok = await register(`entries/${updated['key']}`, updated);
            isDirtyRef.current = false;
            setSaveStatus(ok ? 'saved' : 'error');
        }, AUTOSAVE_DELAY);
    }, [customization, isNew]);

    const handleFirstSave = async () => {
        setSaveStatus('saving');
        const ok = await register(`entries/${tool['key']}`, tool);
        if (ok) { setSaveStatus('saved'); onSaved(); }
        else setSaveStatus('error');
    };

    const update = () => {
        const updated = new Tool(tool);
        setTool(updated);
        scheduleAutosave(updated);
    };

    const handleDelete = async () => {
        if (!pendingDelete) { setPendingDelete(true); return; }
        const ok = await deregister(`entries/${tool['key']}`);
        if (ok) onDeleted();
    };

    // CONTAINERS: --------------------------------------------------------------------------------------------------------------------

    const NameContainer = () => (
        customization ? (
            <input
                className={styles.nameInput}
                value={tool['name']}
                onChange={e => { tool['name'] = e.target.value; update(); }}
                placeholder={t({ text: 'name', language, mode: 'UPPERCASE' })}
            />
        ) : (<div className={styles.nameDisplay}>{tool['name'] || '—'}</div>)
    )

    const DescriptionContainer = () => (
        customization ? 
        (
            <textarea
                className={styles.descriptionInput}
                value={tool['description']}
                onChange={e => { tool['description'] = e.target.value; update(); }}
                placeholder={t({ text: 'description', language, mode: 'PLAIN_FIRST_UPPER' })}
            />
        ) : (<div className={styles.descriptionDisplay}>{tool['description'] || '—'}</div>)
    )

    const ImageContainer = () => <>
            <div
                className={`${styles.imageContainer}${customization ? ` ${styles.imageContainerClickable}` : ''}`}
                onClick={() => { if (!customization) return; triggerUpload(tool['key'], path => { tool['image-path'] = path; update(); }); }}
            >
                <img className={styles.imageImg} src={getImageUrl(tool['image-path'], tool['category'])} alt={tool['name']} />
                {customization && (
                    <div className={styles.imageOverlay}>
                        {uploading ? '...' : '↑'}
                    </div>  
                )}
                {customization && tool['image-path'] && (
                    <button
                        className={styles.imageDeleteBtn}
                        onClick={e => {
                            e.stopPropagation();
                            deleteImage(tool['image-path']!, () => { tool['image-path'] = ''; update(); });
                        }}
                        title="Remove image"
                    >×</button>
                )}
            </div>
    </>

    const KeyContainer = () => <>
        <div className={styles.keyLabel}>{tool['key']}</div>
    </>

    const CategoryContainer = () => <>
        <div className={styles.categoryDropdown} ref={categoryRef}>
            <button
                className={styles.categoryBtn}
                onClick={customization ? () => setCategoryOpen(o => !o) : undefined}
                disabled={!customization}
            >
                {t({ text: tool['category'], language, mode: 'TITLECASE' })}
                {customization && <span className={styles.dropdownCaret}>▾</span>}
            </button>
            {categoryOpen && (
                <div className={styles.dropdownMenu}>
                    {ALL_CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.dropdownOption}${cat === tool['category'] ? ` ${styles.dropdownOptionActive}` : ''}`}
                            onClick={() => { setCategoryOpen(false); onCategoryChange(cat); }}
                        >
                            {t({ text: cat, language, mode: 'TITLECASE' })}
                        </button>
                    ))}
                </div>
            )}
        </div>
    </>

    const TagsContainer = () => <>
        <div className={styles.tagsRow}>
            {tool['tags-list'].map((tag, i) => (
                <div key={i} className={styles.tag}>
                    <span>{tag}</span>
                    {customization && <button className={styles.tagRemove} onClick={() => { tool['tags-list'].splice(i, 1); update(); }}>×</button>}
                </div>
            ))}
            {customization && (
                isAddingTag ? (
                    <input 
                        autoFocus
                        className={styles.tagInput}
                        value={tempTag}
                        onChange={e => setTempTag(e.target.value)}
                        onBlur={() => { if(tempTag.trim()) { tool['tags-list'].push(tempTag.trim()); update(); } setIsAddingTag(false); setTempTag(''); }}
                        onKeyDown={e => { if(e.key === 'Enter') e.currentTarget.blur(); if(e.key === 'Escape') { setTempTag(''); setIsAddingTag(false); } }}
                    />
                ) : (
                    <button className={styles.tagAdd} onClick={() => setIsAddingTag(true)}>+</button>
                )
            )}
        </div>
    </>
    
    const Footer = () => <>
        <div className={styles.footer}>
            <span className={`${styles.saveStatus} ${styles[saveStatus]}`}>
                {saveStatus === 'saving' && t({ text: 'saving',     language, mode: 'UPPERCASE' })}
                {saveStatus === 'saved'  && t({ text: 'saved',      language, mode: 'UPPERCASE' })}
                {saveStatus === 'error'  && t({ text: 'save-error', language, mode: 'UPPERCASE' })}
            </span>
            {isNew ? (
                <button className={styles.saveBtn} onClick={handleFirstSave}>
                    {t({ text: 'save', language, mode: 'UPPERCASE' })}
                </button>
            ) : (
                <>
                    <button
                        className={`${styles.deleteBtn}${pendingDelete ? ` ${styles.deleteBtnConfirm}` : ''}`}
                        onClick={handleDelete}
                    >
                        {pendingDelete ? t({ text: 'confirm-delete', language, mode: 'UPPERCASE' }) : t({ text: 'delete', language, mode: 'UPPERCASE' })}
                    </button>
                    {pendingDelete && (
                        <button className={styles.cancelBtn} onClick={() => setPendingDelete(false)}>
                            {t({ text: 'cancel', language, mode: 'UPPERCASE' })}
                        </button>
                    )}
                </>
            )}
        </div>
    </>

    const KindAndFieldsContainer = () => <>
        <div>
            <div className={styles.sectionLabel}>
                {t({ text: 'kind', language, mode: 'UPPERCASE' })}
            </div>
            <div className={styles.kindDropdown} ref={kindRef}>
                <button
                    className={styles.kindBtn}
                    onClick={customization ? () => setKindOpen(o => !o) : undefined}
                    disabled={!customization}
                >
                    {t({ text: tool['kind'], language, mode: 'TITLECASE' })}
                    {customization && <span className={styles.dropdownCaret}>▾</span>}
                </button>
                {kindOpen && (
                    <div className={styles.dropdownMenu}>
                        {Object.keys(TOOL_KINDS).map(kind => (
                            <button
                                key={kind}
                                className={`${styles.dropdownOption}${kind === tool['kind'] ? ` ${styles.dropdownOptionActive}` : ''}`}
                                onClick={() => { tool['kind'] = kind as (keyof typeof TOOL_KINDS); update(); setKindOpen(false); }}
                            >
                                {t({ text: kind, language, mode: 'TITLECASE' })}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.fieldsList} style={{ marginTop: 12 }}>
                {(TOOL_KINDS[tool['kind']] as readonly string[]).map(field => (
                    <div key={field} className={styles.fieldCard}>
                        <div className={styles.fieldName}>{t({ text: field, language, mode: 'UPPERCASE' })}</div>
                        {customization ? (
                            <div className={styles.fieldValueControls}>
                                <button onClick={() => { (tool as any)[field]--; update(); }}>−</button>
                                <span>{(tool as any)[field] ?? 0}</span>
                                <button onClick={() => { (tool as any)[field]++; update(); }}>+</button>
                            </div>
                        ) : (
                            <div className={styles.fieldValueDisplay}>{(tool as any)[field] ?? 0}</div>
                        )}
                    </div>
                ))}
                <div className={styles.fieldCard}>
                    <div className={styles.fieldName}>{t({ text: 'max-durability', language, mode: 'UPPERCASE' })}</div>
                    {customization ? (
                        <div className={styles.fieldValueControls}>
                            <button onClick={() => { tool['max-durability']--; update(); }}>−</button>
                            <span>{tool['max-durability']}</span>
                            <button onClick={() => { tool['max-durability']++; update(); }}>+</button>
                        </div>
                    ) : (
                        <div className={styles.fieldValueDisplay}>{tool['max-durability']}</div>
                    )}
                </div>
            </div>
        </div>
    </>

    const CompositionsContainer = () => <>
        <div className={styles.compositionsSection}>
            <div className={styles.sectionLabel}>{t({ text: 'compositions', language, mode: 'UPPERCASE' })}</div>
            <div className={styles.compositionList}>
                {tool['compositions-list'].map((comp, i) => (
                    <div key={i} className={styles.compositionCard}>
                        <span className={styles.compositionRef}>{format({ text: (comp as any).name ?? comp.reference, mode: 'UPPERCASE'})}</span>
                        {customization ? (
                            <div className={styles.fieldValueControls}>
                                <button onClick={() => { tool['compositions-list'][i]['value']--; update(); }}>−</button>
                                <span>{comp.value}</span>
                                <button onClick={() => { tool['compositions-list'][i]['value']++; update(); }}>+</button>
                            </div>
                        ) : (
                            <span className={styles.compositionValue}>{comp.value}</span>
                        )}
                        {customization && <button className={styles.compositionRemove} onClick={() => { tool['compositions-list'].splice(i, 1); update(); }}>×</button>}
                    </div>
                ))}
            </div>
            {customization && (
                <div className={styles.compositionAddWrapper}>
                    <button className={styles.compositionAddBtn} onClick={() => setCompositionSearch(true)}>+</button>
                    {compositionSearch && (
                        <FloatingSearch
                            categories={['material']}
                            onSelect={result => { tool['compositions-list'].push({ reference: result.key, name: result.name, value: 1 }); update(); }}
                            onClose={() => setCompositionSearch(false)}
                            placeholder={t({ text: 'search-material', language, mode: 'PLAIN_FIRST_UPPER' })}
                        />
                    )}
                </div>
            )}
        </div>
    </>

    const ModifiersContainer = () => <>
        <div className={styles.modifiersSection}>
            <div className={styles.sectionLabel}>{t({ text: 'modifiers', language, mode: 'UPPERCASE' })}</div>
            <div className={styles.modifiersList}>
                {tool['modifiers'].map((mod, modifierIndex) => (
                    <div key={modifierIndex} className={styles.modifierCard}>
                        {customization ? (
                            <input className={styles.modifierNameInput} value={mod.name}
                                onChange={e => { tool['modifiers'][modifierIndex]['name'] =  e.target.value; update(); }}
                                placeholder={t({ text: 'name', language, mode: 'UPPERCASE' })} />
                        ) : <div className={styles.modifierNameDisplay}>{mod.name || '—'}</div>}

                        {customization ? (
                            <textarea className={styles.modifierDescInput} value={mod.description}
                                onChange={e => { tool['modifiers'][modifierIndex]['description'] =  e.target.value; update(); }}
                                placeholder={t({ text: 'description', language, mode: 'PLAIN_FIRST_UPPER' })} />
                        ) : <div className={styles.modifierDescDisplay}>{mod.description || '—'}</div>}

                        {customization && (
                            <div className={styles.effectsList}>
                                {mod.effects.map((effect, effectIndex) => (
                                    <div key={effectIndex} className={styles.effectRow}>
                                        
                                        <input className={styles.effectIdentifierInput} value={effect.identifier}
                                            onChange={e => { tool['modifiers'][modifierIndex]['effects'][effectIndex]['identifier'] = e.target.value; update(); }}
                                            placeholder={t({ text: 'identifier', language: language, mode: 'LOWERCASE'})} />
                                        
                                        <select className={styles.effectKindSelect} value={effect.kind}
                                            onChange={e => { tool['modifiers'][modifierIndex]['effects'][effectIndex]['kind'] = e.target.value as any; update(); }}>
                                            <option value="adder">{t({ text: 'adder', language: language, mode: 'UPPERCASE'})}</option>
                                            <option value="multiplier">{t({ text: 'multiplier', language: language, mode: 'UPPERCASE'})}</option>
                                            <option value="setter">{t({ text: 'setter', language: language, mode: 'UPPERCASE'})}</option>
                                        </select>
                                        
                                        <div className={styles.effectValueControls}>
                                            <button onClick={() => { tool['modifiers'][modifierIndex]['effects'][effectIndex]['value']--; update(); }}>−</button>
                                            <span>{effect.value}</span>
                                            <button onClick={() => { tool['modifiers'][modifierIndex]['effects'][effectIndex]['value']++; update(); }}>+</button>
                                        </div>
                                        
                                        <button className={styles.effectRemove} onClick={() => { tool['modifiers'][modifierIndex]['effects'].splice(effectIndex, 1); update(); }}>×</button>
                                    
                                    </div>
                                ))}
                                {customization && (
                                    <button className={styles.addEffectBtn} onClick={() => { tool['modifiers'][modifierIndex]['effects'].push({ identifier: '', kind: 'adder' as const, value: 0 }); update(); }}>
                                        + {t({ text: 'effect', language, mode: 'UPPERCASE' })}
                                    </button>
                                )}
                            </div>
                        )}
                        {customization && <button className={styles.modifierRemove} onClick={() => { tool['modifiers'].splice(modifierIndex, 1); update(); }}>×</button>}
                    </div>
                ))}
                {customization && (
                    <button className={styles.addModifierBtn} onClick={() => { tool['modifiers'].push({ name: '', description: '', effects: [] }); update(); }}>
                        + {t({ text: 'modifier', language, mode: 'UPPERCASE' })}
                    </button>
                )}
            </div>
        </div>
    </>

    // --------------------------------------------------------------------------------------------------------------------------

    return (
        <div className={styles.page}>
            <div className={styles.topRow}>
                <div className={styles.imageCol}>
                    {ImageContainer()}
                    {KeyContainer()}
                </div>
                <div className={styles.nameDescCol}>
                    <div className={styles.nameRow}>
                        {NameContainer()}
                        {CategoryContainer()}
                    </div>
                    {DescriptionContainer()}
                </div>
            </div>  
            {TagsContainer()}
            {KindAndFieldsContainer()}
            {CompositionsContainer()}
            {ModifiersContainer()}
            {customization ? Footer() : null}
        </div>
    );

};


export default ToolSubPage;
