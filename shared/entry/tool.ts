// shared/entry/tool.ts


import Entry from "./entry.ts";


const DEFAULT_COMPOSITIONS_LIST = [] as { reference: string, name: string, value: number }[];
const DEFAULT_MAX_DURABILITY = 0 as number;
const DEFAULT_KIND = 'melee-weapon';

const DEFAULT_STAT_VALUE = 0 as number;
export const TOOL_KINDS = {
    'melee-weapon': ['slash-damage', 'pierce-damage', 'bludgeon-damage'],
    'ranged-weapon': ['damage', 'range'],
    'shield': ['defense'],
    'tome': ['content'],
    'instrument': ['harmony'],
    'medical kit': ['quality']
} as const;
type ToolStats = (typeof TOOL_KINDS)[keyof typeof TOOL_KINDS][typeof DEFAULT_STAT_VALUE];
export interface Tool extends Record<ToolStats, typeof DEFAULT_STAT_VALUE> {}

export class Tool extends Entry {
    public 'max-durability': typeof DEFAULT_MAX_DURABILITY;
    public 'compositions-list': typeof DEFAULT_COMPOSITIONS_LIST;
    public 'kind': keyof typeof TOOL_KINDS;

    constructor(source?: Partial<Tool> | null) {

        super(source as Entry);
        this['category'] = 'tool';

        this['max-durability'] = source?.['max-durability'] ?? DEFAULT_MAX_DURABILITY;
        this['compositions-list'] = [...(source?.['compositions-list'] ?? DEFAULT_COMPOSITIONS_LIST)];
        this['kind'] = (source?.['kind'] as keyof typeof TOOL_KINDS) ?? DEFAULT_KIND;

        const allStats = Object.values(TOOL_KINDS).flat() as ToolStats[];
        for (const field of allStats) {
            (this as any)[field] = (source as any)?.[field] ?? DEFAULT_STAT_VALUE;
        }
    }
}


export default Tool;
