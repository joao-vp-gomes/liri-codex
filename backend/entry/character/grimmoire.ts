// backend/entry/character/grimmoire.ts


import Item from "./item.ts";


export const GRIMMOIRE_CAPACITY = 6 as number;

export class Grimmoire {

    public ['slots']: (Item | null)[];

    constructor(source?: (Item | null)[]) {

        this['slots'] = Array.from({ length: GRIMMOIRE_CAPACITY }, (_, i) => source?.[i] ?? null);
        
    }

    public get(index: number): Item | null {

        if (index < 0 || index >= GRIMMOIRE_CAPACITY) return null;
        return this['slots'][index];

    }

    public learn(index: number, item: Item): Item | null {

        if (index < 0 || index >= GRIMMOIRE_CAPACITY) return item;

        const old = this.forget(index);
        this['slots'][index] = item;
        return old;

    }

    public forget(index: number): Item | null {

        if (index < 0 || index >= GRIMMOIRE_CAPACITY) return null;

        const old = this['slots'][index];
        this['slots'][index] = null;
        return old;

    }

}


export default Grimmoire;