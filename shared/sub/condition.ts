// backend/entry/character/condition.ts


export const CONDITIONS = [
    {
        ['identifier']: 'integrity',
        ['dependencies']: [],
        ['base-value']: 3,
        ['rate']: 0,
    },
    {
        ['identifier']: 'health',
        ['dependencies']: ['constitution', 'warrior'],
        ['base-value']: 18,
        ['rate']: 6,
    },
    {
        ['identifier']: 'major-energy',
        ['dependencies']: ['agility', 'rogue'],
        ['base-value']: 1,
        ['rate']: 0.2,
    },
    {
        ['identifier']: 'minor-energy',
        ['dependencies']: ['agility', 'rogue'],
        ['base-value']: 1,
        ['rate']: 0.5,
    },
    {
        ['identifier']: 'reflex-energy',
        ['dependencies']: ['agility', 'rogue'],
        ['base-value']: 1,
        ['rate']: 0.5,
    },
    {
        ['identifier']: 'movement',
        ['dependencies']: ['breath', 'warrior'],
        ['base-value']: 3,
        ['rate']: 1,
    },
];
const DEFAULT_CONDITIONS = Object.fromEntries( CONDITIONS.map(
    condition => [condition['identifier'], 0]
)) as Record<string, number>;

export class Condition {

    public ['current']: typeof DEFAULT_CONDITIONS;

    constructor(source?: typeof DEFAULT_CONDITIONS) {

        this['current'] = { ...DEFAULT_CONDITIONS, ...source };

    }

    public adjustCondition(conditionIdentifier: string, value: number, mode: 'add' | 'set'): boolean {
        
        if (!(conditionIdentifier in this['current'])) return false;

        if (mode==='add') this['current'][conditionIdentifier] += value;
        if (mode==='set') this['current'][conditionIdentifier] = value;
        return true;
        
    }
    
}


export default Condition;