// backend/models/accessory.ts


import Entry from "./entry.ts";


export class Accessory extends Entry {

    constructor(source?: Partial<Accessory>) {

        super(source as Entry)
        this['category'] = 'accessory';
        
    }

}


export default Accessory;