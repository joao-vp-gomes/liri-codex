// backend/models/entryFactory.ts

import { Entry, type EntryCategory } from "./entry.ts";
import Ability from "../entry/ability.ts";
import Accessory from "../entry/accessory.ts";
import Apparel from "../entry/apparel.ts";
import Tool from "./tool.ts";
import Character from "./character/character.ts";
import Material from "./material.ts";
import Pawn from "./pawn.ts";
import Recipe from "./recipe.ts";

export class EntryFactory {

    private static registry: Record<EntryCategory, new (data: any) => Entry> = {
        'entry':     Entry,
        'apparel':   Apparel,
        'tool':      Tool,
        'ability':   Ability,
        'accessory': Accessory,
        'material':  Material,
        'pawn':      Pawn,
        'character': Character,
        'recipe':    Recipe,
    };

    public static instantiate(data: any): Entry {
        const category = data?.['category'] as EntryCategory;
        const TargetClass = this.registry[category] || Entry;
        return new TargetClass(data);
    }

}

export default EntryFactory;