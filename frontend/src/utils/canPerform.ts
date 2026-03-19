// frontend/src/utils/canPerform.ts

import type { ActionType } from "../types/ActionType";
import type { RoleType } from "../types/RoleType";


type ARGS_canPerform = {
    role: RoleType, 
    actions: ActionType[],
    userCharacters: string[],
    targetCharacter: string | null
}
export const canPerform = (args: ARGS_canPerform): boolean => {

    if(args.targetCharacter) return canPerformOnCharacter(args);

    const GENERAL_PERMISSIONS = {
        admin:  ['C', 'R', 'U', 'D'],
        member: ['R'],
        guest:  ['R'],
    };

    return args.actions.every(action => GENERAL_PERMISSIONS[args.role]?.includes(action) ?? false);
    
};


type ARGS_canPerformOnCharacter = {
    role: RoleType,
    actions: ActionType[],
    userCharacters: string[],
    targetCharacter: string | null
}
export const canPerformOnCharacter = (args: ARGS_canPerformOnCharacter): boolean => {

    if (args.role === 'admin') return true;
    if (args.role === 'guest') return args.actions.every(a => a === 'R');
    if (args.role === 'member') {
        return args.actions.every(action => {
            if (action === 'R') return true;
            if (action === 'C') return args.userCharacters.length < 3;
            if (action === 'U' || action === 'D') return args.targetCharacter ? args.userCharacters.includes(args.targetCharacter) : false;
            return false;
        });
    }
    return false;

};
