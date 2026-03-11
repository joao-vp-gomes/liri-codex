// backend/models/pawn.ts


import { Entry } from "./entry";


export class Pawn extends Entry {

    public 'active-traits': {'name': string, 'description': string}[];
    public 'passive-traits': {'name': string, 'description': string}[];
    public 'max-health': number;
    public 'is-unique': boolean;

    constructor(source?: any) {

        super(source)
        this['category'] = 'pawn';

        this['active-traits'] = source['active-traits'] ? [...source['active-traits']] : [];
        this['passive-traits'] = source['passive-traits'] ? [...source['passive-traits']] : [];
        this['max-health'] = source['max-health'] ? source['max-health'] : 0;
        this['is-unique'] = source['is-unique'] ? source['is-unique'] : false;

    }

}


export default Pawn;