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
        ['rate']: 0.17 /* ~1/6 */,
    },
    {
        ['identifier']: 'minor-energy',
        ['dependencies']: ['agility', 'rogue'],
        ['base-value']: 1,
        ['rate']: 0.25,
    },
    {
        ['identifier']: 'movement',
        ['dependencies']: ['breath', 'warrior'],
        ['base-value']: 3,
        ['rate']: 1,
    },
    {
        ['identifier']: 'taint-resistance',
        ['dependencies']: ['temper', 'warrior'],
        ['base-value']: 0,
        ['rate']: 0.5,
    },
    {
        ['identifier']: 'poison-resistance',
        ['dependencies']: ['metabolism', 'rogue'],
        ['base-value']: 0,
        ['rate']: 0.5,
    },
    {
        ['identifier']: 'delirium-resistance',
        ['dependencies']: ['composure', 'sage'],
        ['base-value']: 0,
        ['rate']: 0.5,
    },
    {
        ['identifier']: 'wither-resistance',
        ['dependencies']: ['attunement', 'poet'],
        ['base-value']: 0,
        ['rate']: 0.5,
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
    
}

export default Condition;