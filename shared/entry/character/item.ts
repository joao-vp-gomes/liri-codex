// backend/entry/character/item.ts


import Ability from "../ability.ts";
import Apparel from "../apparel.ts";
import { Entry } from "../entry.ts";
import Material from "../material.ts";
import Tool from "../tool.ts";


export interface Quirk {
    ['name']: string;
    ['description']: string;
    ['orientation']: 'buff' | 'nerf' | 'neutral';
}

const DEFAULT_QUIRKS = [] as Quirk[];
const DEFAULT_CURRENT_DURABILITY = 0 as number;
const DEFAULT_CURRENT_STACK = 1 as number;
const DEFAULT_CURRENT_COOLDOWN = {
    'turn': 0 as number,
    'combat': 0 as number,
    'session': 0 as number
}


type ARGS_item = {
    reference: Entry, 
    quirks?: typeof DEFAULT_QUIRKS, 
    currentDurability?: typeof DEFAULT_CURRENT_DURABILITY, 
    currentStack?: typeof DEFAULT_CURRENT_STACK, 
    currentCooldown?: typeof DEFAULT_CURRENT_COOLDOWN
}
class Item {

    public ['reference']: Entry;
    public ['quirks']: typeof DEFAULT_QUIRKS;
    public ['current-durability']: typeof DEFAULT_CURRENT_DURABILITY;
    public ['current-stack']: typeof DEFAULT_CURRENT_STACK;
    public ['current-cooldown']: typeof DEFAULT_CURRENT_COOLDOWN;

    constructor(args: ARGS_item) {

        this['reference'] = args.reference;
        this['quirks'] = [...(args.quirks ?? DEFAULT_QUIRKS)];
        this['current-durability'] = DEFAULT_CURRENT_DURABILITY;
        this['current-stack'] = DEFAULT_CURRENT_STACK;

        this['current-cooldown'] = DEFAULT_CURRENT_COOLDOWN;

        if (args.reference instanceof Apparel || args.reference instanceof Tool)
            this['current-durability'] = args.currentDurability ?? args.reference['max-durability'];
        
        if (args.reference instanceof Material)
            this['current-stack'] = args.currentStack ?? DEFAULT_CURRENT_STACK;

        if (args.reference instanceof Ability) {
            this['current-cooldown'] = args.currentCooldown ?? args.reference['cooldown'];
        }
        
    }

}


export default Item;