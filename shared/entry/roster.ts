// shared/entry/roster.ts


import Entry from "./entry.ts";
import type Pawn from "./pawn.ts";


const DEFAULT_PAWNS_LIST = [] as Pawn[];

export class Roster extends Entry {

    public ['pawns-list']: typeof DEFAULT_PAWNS_LIST;

    constructor(source?: Partial<Roster>) {

        super(source as Entry)
        this['category'] = 'roster';
        
        this['pawns-list'] = [...DEFAULT_PAWNS_LIST, ...(source?.['pawns-list'] ?? [])];

    }

}


export default Roster;