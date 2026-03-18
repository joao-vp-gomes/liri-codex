// backend/models/recipe.ts


import Entry from "./entry";
import Item from "./character/item.ts";


const DEFAULT_INGREDIENTS = [] as { ['reference-key']: string, ['quantity']: number }[];
const DEFAULT_PRODUCT = null as Item | null;

export class Recipe extends Entry {

    public ['ingredients']: typeof DEFAULT_INGREDIENTS;
    public ['product']: typeof DEFAULT_PRODUCT;

    constructor(source?: Record<string, any> | null) {

        super(source);
        this['category'] = 'recipe';

        this['ingredients'] = [...(source?.['ingredients'] ?? DEFAULT_INGREDIENTS)];
        this['product'] = source?.['product'] ?? DEFAULT_PRODUCT;

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

    public setProduct(item: Item): void {

        this['product'] = item;

    }

}


export default Recipe;