// backend/entry/character/competence.ts


export const PATHS = [
    'warrior',
    'rogue',
    'sage',
    'poet'
]
export const ATTRIBUTES = [
    'constitution',
    'breath',
    'strength',
    'temper',
    'tactics',
    'x',

    'agility',
    'stealth',
    'dexterity',
    'metabolism',
    'precision',
    'shivers',

    'erudition',
    'clinic',
    'pharmacy',
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
const DEFAULT_COMPETENCES = Object.fromEntries( [...PATHS, ...ATTRIBUTES].map(
    competence => [competence, 0]
)) as Record<string, number>;

export class Competence {

    public ['current']: typeof DEFAULT_COMPETENCES;

    constructor(source?: typeof DEFAULT_COMPETENCES) {

        this['current'] = { ...DEFAULT_COMPETENCES, ...source };

    }
    
}


export default Competence