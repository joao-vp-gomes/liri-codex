// backend/models/entry/character/bag.ts


import Material from "../entry/material.ts";
import Item from "./item.ts";


const DEFAULT_MAX_SLOTS = 30 as number;

export class Bag {

    public ['slots']: (Item | null)[];
    private readonly ['max-slots'] = DEFAULT_MAX_SLOTS;

    constructor(source?: (Item | null)[]) {
        this['slots'] = Array.from({ length: this['max-slots'] }, (_, i) => source?.[i] ?? null);
    }

    public get(slotIndex: number): Item | null {
        if (slotIndex < 0 || slotIndex >= this['max-slots']) return null;
        return this['slots'][slotIndex];
    }

    public add(item: Item, slotIndex?: number | null): Item | null {

        if (slotIndex != null) {
            if (slotIndex < 0 || slotIndex >= this['max-slots']) return item;
            return this.addToSlot(item, slotIndex);
        }

        if (item['reference'] instanceof Material && item['reference']['max-stack'] > 1) {

            const trivialSlots = this['slots']
                .map((s, i) => ({ slot: s, index: i }))
                .filter(({ slot }) => slot?.['reference']['key'] === item['reference']['key'] && slot['current-stack'] < (item['reference'] as Material)['max-stack']);

            for (const { index } of trivialSlots) {
                const remainder = this.addToSlot(item, index);
                if (!remainder || remainder['current-stack'] === 0) return null;
                item = remainder;
            }

        }

        const emptyIndex = this._findEmpty();
        if (emptyIndex === null) return item;
        return this.addToSlot(item, emptyIndex);

    }

    private addToSlot(item: Item, slotIndex: number, method: 'DISCARD_EXCEDENT' | 'RETURN_EXCEDENT' = 'RETURN_EXCEDENT'): Item | null {

        const slot = this['slots'][slotIndex];

        if (slot !== null) {
            if (!(item['reference'] instanceof Material) || slot['reference']['key'] !== item['reference']['key']) return item;
            const max = (item['reference'] as Material)['max-stack'];
            const canAdd = max - slot['current-stack'];
            if (canAdd <= 0) return item;
            const adding = Math.min(canAdd, item['current-stack']);
            slot['current-stack'] += adding;
            const excedent = item['current-stack'] - adding;
            if (excedent <= 0) return null;
            if (method === 'DISCARD_EXCEDENT') return null;
            return new Item({ reference: item['reference'], quirks: item['quirks'], currentDurability: item['current-durability'], currentStack: excedent });
        }

        if (!(item['reference'] instanceof Material) || item['current-stack'] <= (item['reference'] as Material)['max-stack']) {
            this['slots'][slotIndex] = item;
            return null;
        }

        const max = (item['reference'] as Material)['max-stack'];
        const excedent = item['current-stack'] - max;
        this['slots'][slotIndex] = new Item({ reference: item['reference'], quirks: item['quirks'], currentDurability: item['current-durability'], currentStack: max });
        if (method === 'DISCARD_EXCEDENT') return null;
        return new Item({ reference: item['reference'], quirks: item['quirks'], currentDurability: item['current-durability'], currentStack: excedent });

    }

    public remove(slotIndex: number, currentStack: number): Item | null {

        const item = this['slots'][slotIndex];
        if (!item) return null;

        if (item['current-stack'] <= currentStack) {
            this['slots'][slotIndex] = null;
            return item;
        }

        item['current-stack'] -= currentStack;
        return new Item({ reference: item['reference'], quirks: item['quirks'], currentDurability: item['current-durability'], currentStack: currentStack });

    }

    public move(slotFrom: number, slotTo: number): boolean {

        if (slotFrom < 0 || slotFrom >= this['max-slots'] || slotTo   < 0 || slotTo   >= this['max-slots']) return false;

        const temp = this['slots'][slotFrom];
        this['slots'][slotFrom] = this['slots'][slotTo];
        this['slots'][slotTo] = temp;

        return true;

    }

    public _findEmpty(): number | null {
        const index = this['slots'].findIndex(s => s === null);
        return index !== -1 ? index : null;
    }

}


export default Bag;