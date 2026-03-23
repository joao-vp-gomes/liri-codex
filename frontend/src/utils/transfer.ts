// frontend/src/utils/transfer.ts


import Character from "../../../shared/entry/character";
import { fetch, register } from "../services/database";


export async function transfer(fromKey: string, toKey: string, bagSlot: number, currentStack: number): Promise<void> {
    
    const from = await fetch(`entries/${fromKey}`) as Character;
    const to   = await fetch(`entries/${toKey}`) as Character;
    
    if (!from || !to) return;
    const removed = from['bag'].remove(bagSlot, currentStack);
    if (!removed) return;
    const remainder = to['bag'].add(removed);
    if (remainder) to['storage'].add(remainder);

    await register(`entries/${fromKey}`, from);
    await register(`entries/${toKey}`, to);

}


export default transfer;