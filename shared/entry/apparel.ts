// shared/entry/apparel.ts


import Entry from "./entry.ts";


const DEFAULT_PROTECTION = {
    ['slash']: 0 as number,
    ['pierce']: 0 as number,
    ['bludgeon']: 0 as number,
    ['arcane']: 0 as number,
};

const DEFAULT_WEIGHT = 0 as number;
const DEFAULT_MAX_DURABILITY = 0 as number;
const DEFAULT_COMPOSITIONS_LIST = [] as { ['reference']: string, ['value']: number }[];

export class Apparel extends Entry {
    
    public ['protection']: typeof DEFAULT_PROTECTION;
    public ['weight']: typeof DEFAULT_WEIGHT;
    public ['max-durability']: typeof DEFAULT_MAX_DURABILITY;
    public ['compositions-list']: typeof DEFAULT_COMPOSITIONS_LIST;

    constructor(source?: Partial<Apparel> | null) {

        super(source as Entry);
        this['category'] = 'apparel';

        this['protection'] = { ...DEFAULT_PROTECTION, ...source?.['protection'] };
        this['weight'] = source?.['weight'] ?? DEFAULT_WEIGHT;
        this['max-durability'] = source?.['max-durability'] ?? DEFAULT_MAX_DURABILITY;
        this['compositions-list'] = [...(source?.['compositions-list'] ?? DEFAULT_COMPOSITIONS_LIST)];
        
    }

}

export default Apparel;