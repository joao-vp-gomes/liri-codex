// backend/models/entry.ts


import generateKey from "../utils/key.ts";


export type EntryCategory = 
    'entry' |
    'weapon' | 
    'apparel' | 
    'tool' |
    'accessory' |
    'ability' |
    'material' |
    'pawn' |
    'character';

export class Entry { 

    public 'key': string;
    public 'name': string;
    public 'image-path': string;
    public 'description': string;
    public 'category': EntryCategory;
    public 'tags-set': string[];
    public 'modifiers': {
        'name': string, 
        'description': string, 
        'effects': {
            'identifier': string,
            'kind': 'adder' | 'multipllier' | 'setter',
            'value': number
        }[]
    }[];

    constructor(source?: any) {

        this['key'] = source && source['key'] ? source['key'] : generateKey();
        this['name'] = source && source['name']? source['name'] : '';
        this['image-path'] = source && source['image-path'] ? source['image-path'] : '';
        this['description'] = source && source['description'] ? source['description'] : '';
        this['category'] = source && source['category']? source['category'] : 'entry';
        this['tags-set'] = source && source['tags-set'] ? [...source['tags-set']] : [];
        this['modifiers'] = source && source['modifiers'] ? [...source['modifiers']] : [];

    }

}
