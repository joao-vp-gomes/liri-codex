// shared/entry/entry.ts


import generateKey from "../utils/key.ts";


export type EntryCategory = (
    'entry' |

    'apparel' |
    'tool' |
    'accessory' |
    'material' |
    'ability' |

    'pawn' |
    'roster' |

    'recipe' | 
    'catalogue' |

    'character'
);

const DEFAULT_KEY = () => generateKey();
const DEFAULT_NAME = '' as string;
const DEFAULT_IMAGE_PATH = '' as string;
const DEFAULT_DESCRIPTION = '' as string;
const DEFAULT_CATEGORY = 'entry' as EntryCategory;
const DEFAULT_TAGS_LIST = [] as string[];
const DEFAULT_MODIFIERS = [] as { 
    ['name']: string, 
    ['description']: string, 
    ['effects']: { 
        ['identifier']: string, 
        ['kind']: 'adder' | 'multiplier' | 'setter', 
        ['value']: number 
    }[] 
}[];

export class Entry { 

    public ['key']: string;
    public ['name']: typeof DEFAULT_NAME;
    public ['image-path']: typeof DEFAULT_IMAGE_PATH;
    public ['description']: typeof DEFAULT_DESCRIPTION;
    public ['category']: typeof DEFAULT_CATEGORY;
    public ['tags-list']: typeof DEFAULT_TAGS_LIST;
    public ['modifiers']: typeof DEFAULT_MODIFIERS;

    constructor(source?: Partial<Entry> | null) {

        this['key'] = source?.['key'] ?? DEFAULT_KEY();
        this['name'] = source?.['name'] ?? DEFAULT_NAME;
        this['image-path'] = source?.['image-path'] ?? DEFAULT_IMAGE_PATH;
        this['description'] = source?.['description'] ?? DEFAULT_DESCRIPTION;
        this['category'] = source?.['category'] ?? DEFAULT_CATEGORY;
        this['tags-list'] = [...(source?.['tags-list'] ?? DEFAULT_TAGS_LIST)];
        this['modifiers'] = [...(source?.['modifiers'] ?? DEFAULT_MODIFIERS)];
        
    }

}


export default Entry;