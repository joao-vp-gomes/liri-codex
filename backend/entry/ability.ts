// backend/models/ability.ts


import Entry from "./entry.ts";


const DEFAULT_COST = {
    ['integrity']: 0 as number,
    ['health']: 0 as number,
    ['major-energy']: 0 as number,
    ['minor-energy']: 0 as number,
    ['reflex-energy']: 0 as number
};
const DEFAULT_COOLDOWN = {
    ['turn']: 0 as number,
    ['combat']: 0 as number,
    ['session']: 0 as number
};
const DEFAULT_RANGE = 0 as number;

export class Ability extends Entry {

    public ['cost']: typeof DEFAULT_COST;
    public ['cooldown']: typeof DEFAULT_COOLDOWN;
    public ['range']: typeof DEFAULT_RANGE;

    constructor(source?: Partial<Ability> | null) {

        super(source as Entry);
        this['category'] = 'ability';

        this['cost'] = { ...DEFAULT_COST, ...source?.['cost'] };
        this['cooldown'] = { ...DEFAULT_COOLDOWN, ...source?.['cooldown'] };
        this['range'] = source?.['range'] ?? DEFAULT_RANGE;
        
    }

}


export default Ability;