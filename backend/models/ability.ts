// backend/models/ability.ts


import { Entry } from "./entry";


type TimeSpan = 
    'turn' |
    'combat' |
    'session';

type CharacterStat =
    'integrity' |
    'health' |
    'major-energy' |
    'minor-energy' |
    'reflex-energy'; 

export class Ability extends Entry {

    public 'cost': {'identifier': CharacterStat, 'value': number}[];
    public 'cooldown': {'identifier': TimeSpan, 'value': number}[];
    public 'range': number;

    constructor(source?: any) {

        super(source)
        this['category'] = 'ability';

        this['cost'] = source['cost'] ? [...source['cost']] : [];
        this['cooldown'] = source['cooldown'] ? [...source['cooldown']] : [];
        this['range'] = source['range'] ? source['range'] : 0;

    }

}


export default Ability;