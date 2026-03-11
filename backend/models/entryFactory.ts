// backend/models/entryFactory.ts


import { Entry, EntryCategory } from "./entry.ts";
import Ability from "./ability.ts";
import Accessory from "./accessory.ts";
import Apparel from "./apparel.ts";
import Tool from "./tool.ts";
import Weapon from "./weapon.ts";
import Character from "./character.ts";
import Material from "./material.ts";
import Pawn from "./pawn.ts";


export class EntryFactory {

    private static registry: Record<string, any> = {
        'entry': Entry,
        'weapon': Weapon,
        'apparel': Apparel,
        'tool': Tool,
        'ability': Ability,
        'accessory': Accessory,
        'material': Material,
        'pawn': Pawn,
        'character': Character
    };

    public static deserialize(data: any): Entry {
        const category = data['category'] as EntryCategory;
        const TargetClass = this.registry[category] || Entry;
        
        return new TargetClass(data);
    }

}