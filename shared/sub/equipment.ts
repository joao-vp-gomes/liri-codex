// backend/entry/character/equipment.ts


import type { EntryCategory } from "../entry.ts";
import Item from "./item.ts";

export const EQUIPMENT_SLOTS = [
    {
        ['identifier']: 'apparel',
        ['categories']: ['apparel'] as EntryCategory[]
    },
    {
        ['identifier']: 'left-tool',
        ['categories']: ['tool'] as EntryCategory[]
    },
    {
        ['identifier']: 'right-tool',
        ['categories']: ['tool'] as EntryCategory[]
    },
    {
        ['identifier']: 'accessory',
        ['categories']: ['accessory'] as EntryCategory[]
    },
    {
        ['identifier']: 'companion',
        ['categories']: ['pawn'] as EntryCategory[]
    }
    
] as const;

export type SlotIdentifier = typeof EQUIPMENT_SLOTS[number]['identifier'];
const DEFAULT_EQUIPMENT = Object.fromEntries(
    EQUIPMENT_SLOTS.map(s => [s['identifier'], null])
) as Record<SlotIdentifier, Item | null>;

export class Equipment {

    public ['current']: typeof DEFAULT_EQUIPMENT;

    constructor(source?: Partial<Record<SlotIdentifier, Item | null>>) {

        this['current'] = { ...DEFAULT_EQUIPMENT, ...source };

    }

    public equip(slot: SlotIdentifier, item: Item): boolean {

        const config = EQUIPMENT_SLOTS.find(s => s['identifier'] === slot);
        if (!config) return false;

        if (!config['categories'].includes(item['reference']['category'])) return false;

        this['current'][slot] = item;
        return true;

    }

    public unequip(slot: SlotIdentifier): Item | null {

        const item = this['current'][slot];
        this['current'][slot] = null;
        return item;

    }

}


export default Equipment;