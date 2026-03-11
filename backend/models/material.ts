// backend/models/material.ts


import { Entry } from "./entry";


export class Material extends Entry {

    public 'is-stackable': boolean;

    constructor(source?: any) {

        super(source)
        this['category'] = 'material';

        this['is-stackable'] = source['is-stackable'] ? source['is-stackable'] : true;

    }

}


export default Material;