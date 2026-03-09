// frontend/src/utils/canPerform.ts

/*

Rege, no frontend, que papeis tem permissoes de fazer que acoes na database.

*/

import type { RoleType } from "../types/RoleType";
import type { ActionType } from "../types/ActionType";

const permissions: Record<RoleType, ActionType[]> = {
    admin: ['C', 'R', 'U', 'D'],
    member: ['R', 'U'],
    guest: ['R']
};

export const canPerform = (role: string | null | undefined, action: ActionType): boolean => {
    const userRole = (role as RoleType) || 'guest';
    return permissions[userRole]?.includes(action) ?? false;
};

