// backend/models/apparel.ts


import { Entry } from "./entry";


type Aspect = 
    'slash' | 'pierce' | 'bludgeon'
    | 'fire' | 'taint' | 'poison' | 'wither';

export class Apparel extends Entry {
    
    public 'protection': {'identifier': Aspect, 'value': number}[];
    public 'weight': number;
    public 'max-durability': number;

    constructor(source?: any) {

        super(source)
        this['category'] = 'apparel';
        
        this['protection'] = source['protection'] ? [...source['protection']] : [];
        this['weight'] = source['weight'] ? source['weight'] : 0;
        this['max-durability'] = source['max-durability'] ? source['max-durability'] : 0;

    }

}


export default Apparel;