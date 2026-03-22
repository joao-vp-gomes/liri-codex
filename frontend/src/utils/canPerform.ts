// frontend/src/utils/canPerform.ts


import type { ActionType } from "../types/actionType";
import type { RoleType } from "../types/roleType";


export const canPerform = (
    role: RoleType,
    actions: ActionType[],
    userCharacters: string[] = [],
    targetCharacter: string | null = null
): boolean => {

    if (role === 'admin') return true;

    if (role === 'member') {
        return actions.every(action => {
            if (action === 'R') return true;
            if (targetCharacter) {
                if (action === 'U' || action === 'D') return userCharacters.includes(targetCharacter);
                if (action === 'C') return userCharacters.length < 3;
            }
            return false;
        });
    }

    // FALLBACK
    return actions.every(a => a === 'R');

};