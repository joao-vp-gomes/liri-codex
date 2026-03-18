// frontend/src/utils/canPerform.ts


type ActionType = 'C' | 'R' | 'U' | 'D';
type RoleType = 'admin' | 'member' | 'guest';

type ARGS_canPerform = {
    role: RoleType, 
    action: ActionType
}
export const canPerform = (args: ARGS_canPerform): boolean => {

    const GENERAL_PERMISSIONS = {
        admin:  ['C', 'R', 'U', 'D'],
        member: ['R'],
        guest:  ['R'],
    };

    return GENERAL_PERMISSIONS[args.role]?.includes(args.action) ?? false;
    
};


type ARGS_canPerformOnCharacter = {
    role: RoleType,
    action: ActionType,
    userCharacters: string[],
    targetCharacter: string
}
export const canPerformOnCharacter = (args: ARGS_canPerformOnCharacter): boolean => {

    if (args.role === 'admin') return true;
    if (args.role === 'guest') return (args.action === 'R');
    if (args.role === 'member') {
        if (args.action === 'R') return true;
        if (args.action === 'C') return (args.userCharacters.length < 3);
        if (args.action === 'U' || args.action === 'D') return args.targetCharacter ? args.userCharacters.includes(args.targetCharacter) : false;
    }

    return false;

};
