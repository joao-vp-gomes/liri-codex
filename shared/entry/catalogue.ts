// shared/entry/catalogue.ts


import Entry from "./entry.ts";
import type Recipe from "./recipe.ts";


const DEFAULT_RECIPES_LIST = [] as Recipe[];

export class Catalogue extends Entry {

    public ['recipes-list']: typeof DEFAULT_RECIPES_LIST;

    constructor(source?: Partial<Catalogue>) {

        super(source as Entry)
        this['category'] = 'catalogue';
        
        this['recipes-list'] = [...DEFAULT_RECIPES_LIST, ...(source?.['recipes-list'] ?? [])];

    }

}


export default Catalogue;