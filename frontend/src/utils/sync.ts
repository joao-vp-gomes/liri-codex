// frontend/src/utils/sync.ts

import Character from "../../../shared/entry/character";
import Recipe from "../../../shared/entry/recipe";
import Catalogue from "../../../shared/entry/catalogue";
import { EQUIPMENT_SLOTS } from "../../../shared/sub/equipment";
import { fetch, register } from "../services/database";

export async function sync(key: string): Promise<void> {

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

    if (entry instanceof Catalogue) {
        for (let i = 0; i < entry['recipes-list'].length; i++) {
            const recipe = entry['recipes-list'][i];
            const freshRecipe = await fetch(`entries/${recipe['key']}`);
            if (!freshRecipe) {
                entry['recipes-list'].splice(i, 1);
                i--;
            } else {
                entry['recipes-list'][i] = freshRecipe as Recipe;
            }
        }
    }

    

    await register(`entries/${entry['key']}`, entry);

}


export default sync;