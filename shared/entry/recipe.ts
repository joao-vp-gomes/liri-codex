// shared/entry/recipe.ts


import Entry from "./entry";
import Item from "../sub/item.ts";


const DEFAULT_INGREDIENTS = [] as { ['reference-key']: string, ['quantity']: number }[];
const DEFAULT_PRODUCT = null as Item | null;
const DEFAULT_COMPETENCE = {
    ['identifier']: '' as string,
    ['value']: 0 as number,
    ['practice-contribution']: 1 as number
}
 
export class Recipe extends Entry {

    public ['ingredients']: typeof DEFAULT_INGREDIENTS;
    public ['product']: typeof DEFAULT_PRODUCT;
    public ['competence']: typeof DEFAULT_COMPETENCE;

    constructor(source?: Record<string, any> | null) {

        super(source);
        this['category'] = 'recipe';

        this['ingredients'] = [...(source?.['ingredients'] ?? DEFAULT_INGREDIENTS)];
        this['product'] = source?.['product'] ?? DEFAULT_PRODUCT;
        this['competence'] = { ...DEFAULT_COMPETENCE, ...source?.['competence']};

    }

    public addIngredient(referenceKey: string, quantity: number = 1): void {

        const existing = this['ingredients'].find(i => i['reference-key'] === referenceKey);
        if (existing) { existing['quantity'] += quantity; return; }

        this['ingredients'].push({ ['reference-key']: referenceKey, ['quantity']: quantity });

    }

    public removeIngredient(referenceKey: string, quantity: number = 1): void {

        const index = this['ingredients'].findIndex(i => i['reference-key'] === referenceKey);
        if (index === -1) return;

        const ingredient = this['ingredients'][index];
        if (ingredient['quantity'] <= quantity) this['ingredients'].splice(index, 1);
        else ingredient['quantity'] -= quantity;

    }

}


export default Recipe;