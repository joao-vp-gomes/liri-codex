// backend/entry/character/competence.ts


export const ATTRIBUTES = [

    // PATHS: ----
    'warrior',
    'rogue',
    'sage',
    'poet',
    // -----------

    'constitution',
    'breath',
    'strength',
    'temper',
    'prowess',
    'tactics',

    'agility',
    'stealth',
    'dexterity',
    'metabolism',
    'precision',
    'shivers',

    'erudition',
    'clinic',
    'brewing',
    'artifice',
    'composure',
    'insight',

    'drama',
    'rhetoric',
    'threat',
    'attunement',
    'melody',
    'empathy',
];
const DEFAULT_CONSTELLATION = Object.fromEntries( [...ATTRIBUTES].map(
    star => [star, 0]
)) as Record<string, number>;

export class Constellation {

    public ['current']: typeof DEFAULT_CONSTELLATION;

    constructor(source?: typeof DEFAULT_CONSTELLATION) {

        this['current'] = { ...DEFAULT_CONSTELLATION, ...source };

    }

    public adjustAttribute(attributeIdentifier: string, value: number, mode: 'add' | 'set'): boolean {
        
        if (!(attributeIdentifier in this['current'])) return false;

        if (mode==='add') this['current'][attributeIdentifier] += value;
        if (mode==='set') this['current'][attributeIdentifier] = value;
        return true;
        
    }
    
}


export default Constellation