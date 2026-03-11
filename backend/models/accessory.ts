// backend/models/accessory.ts


import { Entry } from "./entry";


export class Accessory extends Entry {

    constructor(source?: any) {

        super(source)
        this['category'] = 'accessory';

    }

}


export default Accessory;