// backend/models/material.ts


import Entry from "./entry.ts";


const DEFAULT_MAX_STACK = 1 as number;

export class Material extends Entry {

    public ['max-stack']: typeof DEFAULT_MAX_STACK;

    constructor(source?: Partial<Material> | null) {

        super(source as Entry);
        this['category'] = 'material';
        
        this['max-stack'] = source?.['max-stack'] ?? DEFAULT_MAX_STACK;
        
    }

}


export default Material;