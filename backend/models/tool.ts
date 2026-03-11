// backend/models/tool.ts


import { Entry } from "./entry";


export class Tool extends Entry {
    
    public 'quality': number;
    public 'max-durability': number;

    constructor(source?: any) {

        super(source)
        this['category'] = 'tool';
      
        this['quality'] = source['quality'] ? source['quality'] : 0;
        this['max-durability'] = source['max-durability'] ? source['max-durability'] : 0;

    }

}


export default Tool;