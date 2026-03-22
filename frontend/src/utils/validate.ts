// frontend/src/utils/validate.ts


import Character from "../../../shared/entry/character/character";
import Recipe from "../../../shared/entry/recipe"; 
import { EQUIPMENT_SLOTS } from "../../../shared/entry/character/equipment";
import { fetch, register, } from "../services/database";


export async function validate(key: string): Promise<void> {

    const entry = await fetch(`entries/${key}`);
    if (!entry) return;

    if (entry instanceof Character) {

        for (const slot of EQUIPMENT_SLOTS) {
            const item = entry['equipment']['current'][slot['identifier']];
            if (!item) continue;
            const fresh = await fetch(`entries/${item['reference']['key']}`);
            if (!fresh) entry['equipment']['current'][slot['identifier']] = null;
            else item['reference'] = fresh;
        }

        for (let i = 0; i < entry['grimmoire']['slots'].length; i++) {
            const item = entry['grimmoire']['slots'][i];
            if (!item) continue;
            const fresh = await fetch(`entries/${item['reference']['key']}`);
            if (!fresh) entry['grimmoire']['slots'][i] = null;
            else item['reference'] = fresh;
        }

        for (let i = 0; i < entry['bag']['slots'].length; i++) {
            const item = entry['bag']['slots'][i];
            if (!item) continue;
            const fresh = await fetch(`entries/${item['reference']['key']}`);
            if (!fresh) entry['bag']['slots'][i] = null;
            else item['reference'] = fresh;
        }

        for (const [index, item] of entry['storage']['slots']) {
            const fresh = await fetch(`entries/${item['reference']['key']}`);
            if (!fresh) entry['storage']['slots'].delete(index);
            else item['reference'] = fresh;
        }

    }

    if (entry instanceof Recipe) {

        if (entry['product']) {
            const fresh = await fetch(`entries/${entry['product']['reference']['key']}`);
            if (!fresh) entry['product'] = null;
            else entry['product']['reference'] = fresh;
        }

    }

    await register(`entries/${entry['key']}`, entry);

}


export default validate;