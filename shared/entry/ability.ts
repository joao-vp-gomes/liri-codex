// shared/entry/ability.ts


import Entry from "./entry.ts";


const DEFAULT_COST = {
    ['integrity']: 0 as number,
    ['health']: 0 as number,
    ['major-energy']: 0 as number,
    ['minor-energy']: 0 as number,
    ['reflex-energy']: 0 as number
};
const DEFAULT_COOLDOWN = 0 as number;
const DEFAULT_DURATION = 0 as number; // -1 FOR INFINITE
const DEFAULT_RANGE = 0 as number;
const DEFAULT_COMPETENCE = {
    ['identifier']: '' as string,
    ['value']: 0 as number,
    ['practice-contribution']: 1 as number
} 

export class Ability extends Entry {
 
    public ['cost']: typeof DEFAULT_COST;
    public ['cooldown']: typeof DEFAULT_COOLDOWN;
    public ['duration']: typeof DEFAULT_DURATION;
    public ['range']: typeof DEFAULT_RANGE;
    public ['competence']: typeof DEFAULT_COMPETENCE;

    constructor(source?: Partial<Ability> | null) {

        super(source as Entry);
        this['category'] = 'ability';

        this['cost'] = { ...DEFAULT_COST, ...source?.['cost'] };
        this['cooldown'] = source?.['cooldown'] ?? DEFAULT_COOLDOWN;
        this['duration'] = source?.['duration'] ?? DEFAULT_DURATION;
        this['range'] = source?.['range'] ?? DEFAULT_RANGE;
        this['competence'] = { ...DEFAULT_COMPETENCE, ...source?.['competence']};
        
    }

}


export default Ability;