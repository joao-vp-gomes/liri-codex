// backend/entry/character/storage.ts


import Material from "../material.ts";
import Item from "./item.ts";


export class Storage {

    public ['slots']: Map<number, Item>;

    constructor(source?: Map<number, Item> | [number, Item][] | Record<string, Item> | null) {

        if (!source) this['slots'] = new Map();
        else if (source instanceof Map) this['slots'] = new Map(source);
        else if (Array.isArray(source)) this['slots'] = new Map(source);
        else this['slots'] = new Map(Object.entries(source).map(([k, v]) => [Number(k), v]));
    
    }

    public get(index: number): Item | null {

        return this['slots'].get(index) ?? null;

    }

    public add(item: Item): boolean {

        if (item['reference'] instanceof Material) {
            for (const [_, existing] of this['slots']) {
                if (existing['reference']['key'] === item['reference']['key']) {
                    existing['current-stack'] += item['current-stack'];
                    return true;
                }
            }
        }

        const target = this.nextEmpty();
        this['slots'].set(target, item);
        return true;

    }

    public remove(index: number, currentStack: number = 1): Item | null {

        const item = this['slots'].get(index);
        if (!item) return null;

        if (item['current-stack'] <= currentStack) {
            this['slots'].delete(index);
            return item;
        }

        item['current-stack'] -= currentStack;
        return new Item({ reference: item['reference'], quirks: item['quirks'], currentDurability: item['current-durability'], currentStack: currentStack });

    }

    private nextEmpty(): number {

        let index = 0;
        while (this['slots'].has(index)) index++;

        return index;
        
    }

}


export default Storage;