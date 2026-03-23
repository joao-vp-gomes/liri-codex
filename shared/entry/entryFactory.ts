// shared/entry/entryFactory.ts

import { Entry, type EntryCategory } from "./entry.ts";
import Ability from "../entry/ability.ts";
import Accessory from "../entry/accessory.ts";
import Apparel from "../entry/apparel.ts";
import Tool from "./tool.ts";
import Character from "./character.ts";
import Material from "./material.ts";
import Pawn from "./pawn.ts";
import Recipe from "./recipe.ts";
import Catalogue from "./catalogue.ts";
import Roster from "./roster.ts";

export class EntryFactory {

    private static registry: Record<EntryCategory, new (data: any) => Entry> = {
        'entry': Entry,

        'apparel': Apparel,
        'tool': Tool,
        'accessory': Accessory,
        'material': Material,
        'ability': Ability,

        'pawn': Pawn,
        'roster': Roster,

        'recipe': Recipe,
        'catalogue': Catalogue,

        'character': Character
    };

    public static instantiate(data: any): Entry {
        const category = data?.['category'] as EntryCategory;
        const TargetClass = this.registry[category] || Entry;
        return new TargetClass(data);
    }

}

export default EntryFactory;