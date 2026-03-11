
import { Entry, EntryCategory } from "../models/entry.ts";
import Ability from "../models/ability.ts";
import Accessory from "../models/accessory.ts";
import Apparel from "../models/apparel.ts";
import Tool from "../models/tool.ts";
import Weapon from "../models/weapon.ts";
import Character from "../models/character.ts";
import Material from "../models/material.ts";
import Pawn from "../models/pawn.ts";
import { EntryFactory } from "../models/entryFactory";

const serial = {
    defense: 2,
    name: 'jon',

    modifiers: [
        {
            name: '1name',
            description: '1desc',
            effects: [
                {
                    identifier: '1.1id',
                    kind: 'adder',
                    value: 1
                },
                {
                    identifier: '1.2id',
                    kind: 'multiplier',
                    value: 2
                }
            ]
        },
        {
            name: '2name',
            description: '2desc',
            effects: [
                {
                    identifier: '2.1id',
                    kind: 'setter',
                    value: 10
                },
                {
                    identifier: '2.2id',
                    kind: 'adder',
                    value: 4
                }
            ]
        }
    ]
}
let test: Entry = EntryFactory.deserialize(serial);


//console.log(JSON.parse(JSON.stringify(test)).category)





const test2 = {
    a: 2,
    b: 3,
    c: 4
}

console.log({...test2, b: 30})