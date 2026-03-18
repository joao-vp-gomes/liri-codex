// frontend/src/utils/transfer.ts


import Character from "../../../backend/entry/character/character";
import Archive from "../services/database";


export async function transfer(fromKey: string, toKey: string, bagSlot: number, currentStack: number): Promise<void> {

    const from = await Archive.fetch(fromKey) as Character;
    const to = await Archive.fetch(toKey) as Character;
    if (!from || !to) return;

    const removed = from['bag'].remove(bagSlot, currentStack);
    if (!removed) return;

    const remainder = to['bag'].add(removed);
    if (remainder) to['storage'].add(remainder);

    await Archive.register(from);
    await Archive.register(to);

}

