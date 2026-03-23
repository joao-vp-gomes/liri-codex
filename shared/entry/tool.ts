// shared/entry/tool.ts


import Entry from "./entry.ts";


const DEFAULT_COMPOSITIONS_LIST = [] as { ['reference']: string, ['value']: number }[];
const DEFAULT_MAX_DURABILITY = 0 as number;
const DEFAULT_QUALITY = 0 as number;

export const TOOLS = [
    { 
        ['identifier']: 'melee-weapon',
        ['fields']: ['slash-damage', 'pierce-damage', 'bludgeon-damage', 'defense'] 
    },
    { 
        ['identifier']: 'bow', 
        ['fields']: ['damage'] 
    },
    { 
        ['identifier']: 'staff', 
        ['fields']: ['connection']                 
    }
] as const;
type ToolKind = typeof TOOLS[number];
export type KindIdentifier = ToolKind['identifier'];
type KindFields<K extends KindIdentifier> = Extract<ToolKind, { identifier: K }>['fields'][number];
type ToolStats<K extends KindIdentifier = KindIdentifier> = { ['kind']: K } & { [F in KindFields<K>]: number };
function resolveStats(source?: Partial<Tool> | null): ToolStats {
    const kind = source?.['stats']?.['kind'] ?? 'melee-weapon';
    const fields = TOOLS.find(t => t['identifier'] === kind)?.['fields'] ?? [];
    return Object.fromEntries([['kind', kind], ...fields.map(f => [f, (source?.['stats'] as any)?.[f] ?? 0])]) as ToolStats;
}

export class Tool extends Entry {

    public ['quality']: typeof DEFAULT_QUALITY;
    public ['max-durability']: typeof DEFAULT_MAX_DURABILITY;
    public ['compositions-list']: typeof DEFAULT_COMPOSITIONS_LIST;
    public ['stats']: ToolStats;

    constructor(source?: Partial<Tool> | null) {

        super(source as Entry);

        this['category'] = 'tool';
        this['quality'] = source?.['quality'] ?? DEFAULT_QUALITY;
        this['max-durability'] = source?.['max-durability'] ?? DEFAULT_MAX_DURABILITY;
        this['compositions-list'] = [...(source?.['compositions-list'] ?? DEFAULT_COMPOSITIONS_LIST)];
        this['stats'] = resolveStats(source);

    }

    public static changeKind(tool: Tool, kind: KindIdentifier): Tool {
        return new Tool({ ...tool, stats: { kind } as any });
    }

}


export default Tool;