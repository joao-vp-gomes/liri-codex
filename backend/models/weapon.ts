// backend/models/weapon.ts


import { Entry } from "./entry";


type Aspect = 
    'slash' | 'pierce' | 'bludgeon'
    | 'fire' | 'taint' | 'poison' | 'wither';

export class Weapon extends Entry {
    
    public 'damage': {'identifier': Aspect, 'value': number}[];
    public 'defense': number;
    public 'max-durability': number;

    constructor(source?: any) {

        super(source);
        this['category'] = 'weapon';

        this['damage'] = source['damage'] ? [...source['damage']] : [];
        this['defense'] = source['defense'] ? source['defense'] : 0;
        this['max-durability'] = source['max-durability'] ? source['max-durability'] : 0;

    }

}


export default Weapon;