// shared/entry/pawn.ts


import Constellation from "../sub/constellation.ts";
import Entry from "./entry.ts";


type Trait = { ['name']: string, ['description']: string };

const DEFAULT_ACTIVE_TRAITS = [] as Trait[];
const DEFAULT_PASSIVE_TRAITS = [] as Trait[];
const DEFAULT_MAX_HEALTH = 0 as number;
const DEFAULT_IS_UNIQUE = true as boolean;

export class Pawn extends Entry {

    public ['active-traits']: typeof DEFAULT_ACTIVE_TRAITS;
    public ['passive-traits']: typeof DEFAULT_PASSIVE_TRAITS;
    public ['max-health']: typeof DEFAULT_MAX_HEALTH;
    public ['is-unique']: typeof DEFAULT_IS_UNIQUE;
    public ['constellation']: Constellation;

    constructor(source?: Partial<Pawn> | null) {

        super(source as Entry);
        this['category'] = 'pawn';

        this['active-traits'] = [...(source?.['active-traits'] ?? DEFAULT_ACTIVE_TRAITS)];
        this['passive-traits'] = [...(source?.['passive-traits'] ?? DEFAULT_PASSIVE_TRAITS)];
        this['max-health'] = source?.['max-health'] ?? DEFAULT_MAX_HEALTH;
        this['is-unique'] = source?.['is-unique'] ?? DEFAULT_IS_UNIQUE;
        this['constellation'] = new Constellation(source?.['constellation']?.['current']);

    }

}


export default Pawn;