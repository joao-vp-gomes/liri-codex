// frontend/src/services/database.ts


import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Entry } from '../../../backend/entry/entry';
import EntryFactory from '../../../backend/entry/entryFactory';


export const Archive = {

    async fetch(key: string): Promise<Entry | null> {
        try {
            const snapshot = await getDoc(doc(db, 'entries', key));
            if (!snapshot.exists()) return null;
            return EntryFactory.instantiate(JSON.parse(snapshot.data()['data']));
        } catch { return null; }
    },

    async fetchAll(): Promise<Entry[]> {
        try {
            const snapshot = await getDocs(collection(db, 'entries'));
            return snapshot.docs.map(d => EntryFactory.instantiate(JSON.parse(d.data()['data'])));
        } catch { return []; }
    },

    async fetchByCategory(category: string): Promise<Entry[]> {
        try {
            const all = await this.fetchAll();
            return all.filter(e => e['category'] === category);
        } catch { return []; }
    },

    async fetchByName(name: string): Promise<Entry | null> {
        try {
            const all = await this.fetchAll();
            return all.find(e => e['name'] === name) ?? null;
        } catch { return null; }
    },

    async register(entry: Entry): Promise<boolean> {
        try {
            await setDoc(doc(db, 'entries', entry['key']), { data: JSON.stringify(entry) });
            return true;
        } catch { return false; }
    },

    async deregister(keyOrEntry: string | Entry): Promise<boolean> {
        const key = typeof keyOrEntry === 'string' ? keyOrEntry : keyOrEntry['key'];
        try {
            await deleteDoc(doc(db, 'entries', key));
            return true;
        } catch { return false; }
    },

    async contains(key: string): Promise<boolean> {
        try {
            const snapshot = await getDoc(doc(db, 'entries', key));
            return snapshot.exists();
        } catch { return false; }
    }

};


export default Archive;