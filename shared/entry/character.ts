// shared/entry/character.ts


import Entry from "./entry.ts";
import Ability from "./ability.ts";
import Bag from "../sub/bag.ts";
import Equipment, { EQUIPMENT_SLOTS, type SlotIdentifier } from "../sub/equipment.ts";
import Grimmoire from "../sub/grimmoire.ts";
import Item from "../sub/item.ts";
import Condition, { CONDITIONS } from "../sub/condition.ts";
import Storage from "../sub/storage.ts";
import Recipe from "./recipe.ts";
import Constellation from "../sub/constellation.ts";
import Scroll from "../sub/scroll.ts";


export class Character extends Entry {

    public ['constellation']: Constellation;
    public ['scroll']: Scroll;
    public ['condition']: Condition;

    public ['bag']: Bag;
    public ['storage']: Storage;
    public ['equipment']: Equipment;
    public ['grimmoire']: Grimmoire;

    constructor(source?: Record<string, any>) {

        super(source);
        this['category'] = 'character';

        this['constellation'] = new Constellation(source?.['constellation']?.['current']);
        this['scroll'] = new Scroll(source?.['scroll']?.['current']);
        this['condition'] = new Condition(source?.['condition']?.['current']);

        this['bag'] = new Bag(source?.['bag']?.['slots']);
        this['storage'] = new Storage(source?.['storage']?.['slots']);
        this['equipment'] = new Equipment(source?.['equipment']?.['current']);
        this['grimmoire'] = new Grimmoire(source?.['grimmoire']?.['slots']);
        
    }

    // BAG <-> ENVIRONMENT
    public gather(reference: Entry, bagSlot?: number): Item | null {
        return this['bag'].add(new Item({ reference }), bagSlot);
    }
    public drop(bagSlot: number, currentStack?: number): Item | null {
        return this['bag'].remove(bagSlot, currentStack ?? this['bag'].get(bagSlot)?.['current-stack'] ?? 0);
    }

    // BAG <-> STORAGE
    public store(bagSlot: number, currentStack?: number): boolean {

        const item = this['bag'].get(bagSlot);
        if (!item) return false;

        const amount = Math.min(currentStack ?? item['current-stack'], item['current-stack']);
        const removed = this['bag'].remove(bagSlot, amount);
        if (!removed) return false;
        this['storage'].add(removed);

        return true;

    }
    public retrieve(storageSlot: number, currentStack?: number): boolean {

        const item = this['storage'].get(storageSlot);
        if (!item) return false;

        const amount = Math.min(currentStack ?? item['current-stack'], item['current-stack']);
        const toAdd = new Item({ reference: item['reference'], quirks: item['quirks'], currentDurability: item['current-durability'], currentStack: amount });

        const remainder = this['bag'].add(toAdd);
        const added = amount - (remainder?.['current-stack'] ?? 0);
        if (added === 0) return false;

        this['storage'].remove(storageSlot, added);
        if (remainder) this['storage'].add(remainder);

        return true;

    }   

    // BAG <-> EQUIPMENT
    public equip(bagSlot: number, equipmentSlot: SlotIdentifier): boolean {

        const item = this['bag'].get(bagSlot);
        if (!item) return false;

        const old = this['equipment'].unequip(equipmentSlot);

        if (!this['equipment'].equip(equipmentSlot, item)) {
            if (old) this['equipment'].equip(equipmentSlot, old);
            return false;
        }

        this['bag'].remove(bagSlot, item['current-stack']);

        if (old) {
            const remainder = this['bag'].add(old, bagSlot);
            if (remainder) {
                this['equipment'].unequip(equipmentSlot);
                this['equipment'].equip(equipmentSlot, old);
                this['bag'].add(item, bagSlot);
                return false;
            }
        }

        return true;

    }
    public unequip(equipmentSlot: SlotIdentifier): boolean {

        const item = this['equipment'].unequip(equipmentSlot);
        if (!item) return false;

        const remainder = this['bag'].add(item);
        if (remainder) {
            this['equipment'].equip(equipmentSlot, item);
            return false;
        }

        return true;

    }

    // GRIMMOIRE <-> ENVIRONMENT
    public learnAbility(index: number, ability: Ability, method: 'HARD_REPLACEMENT' | 'SOFT_REPLACEMENT' | 'SUPER_SOFT_REPLACEMENT'): Item | null {

        const item = new Item({ reference: ability, currentCooldown: { ...ability['cooldown'] } });

        if (method === 'SUPER_SOFT_REPLACEMENT') {
            const current = this['grimmoire'].get(index);
            if (current && this['bag']._findEmpty() === null) return item;
        }

        const old = this['grimmoire'].learn(index, item);

        if (old) {
            if (method === 'HARD_REPLACEMENT') return null;
            const remainder = this['bag'].add(old);
            if (method === 'SOFT_REPLACEMENT') return null;
            return remainder;
        }

        return null;

    }
    public forgetAbility(index: number): Item | null {

        return this['grimmoire'].forget(index);

    }
    useAbility(index: number) {

        const competence = {...(this['grimmoire'].get(index)?.reference as Ability)['competence']};
        this['scroll'].adjustExperience(competence['identifier'], competence['practice-contribution'], 'add');

    }

    public produce(recipe: Recipe, bagSlots: number[]): boolean {

        if (!recipe['product']) return false;

        const providedItems = bagSlots.map(slot => ({ slot, item: this['bag'].get(slot) }));
        if (providedItems.some(({ item }) => item === null)) return false;

        const provided = new Map<string, { currentStack: number, slots: { slot: number, item: Item }[] }>();
        for (const { slot, item } of providedItems) {
            const key = item!['reference']['key'];
            if (!provided.has(key)) provided.set(key, { currentStack: 0, slots: [] });
            const entry = provided.get(key)!;
            entry.currentStack += item!['current-stack'];
            entry.slots.push({ slot, item: item! });
        }

        for (const ingredient of recipe['ingredients']) {
            const entry = provided.get(ingredient['reference-key']);
            if (!entry || entry.currentStack < ingredient['quantity']) return false;
        }

        for (const ingredient of recipe['ingredients']) {
            let remaining = ingredient['quantity'];
            for (const { slot, item } of provided.get(ingredient['reference-key'])!.slots) {
                if (remaining <= 0) break;
                const consume = Math.min(remaining, item['current-stack']);
                this['bag'].remove(slot, consume);
                remaining -= consume;
            }
        }

        this['bag'].add(recipe['product']!);
        return true;

    }
    public repair(itemSlot: number, materialSlot: number): boolean {

        const target = this['bag'].get(itemSlot);
        const material = this['bag'].get(materialSlot);
        if (!target || !material) return false;

        const composition = (target['reference'] as any)?.['compositions-list']
            ?.find((c: any) => c['reference'] === material['reference']['key']);
        if (!composition) return false;

        target['current-durability'] = Math.min(
            target['current-durability'] + composition['value'],
            (target['reference'] as any)['max-durability']
        );

        this['bag'].remove(materialSlot, 1);
        return true;

    }

    private _getEffects(identifier: string) {

        const sources: Entry[] = [
            this,
            ...EQUIPMENT_SLOTS.map(s => this['equipment']['current'][s['identifier']]?.['reference']),
            ...this['grimmoire']['slots'].filter(s => s !== null).map(s => s!['reference']),
        ].filter((s): s is Entry => s != null);

        return sources.flatMap(source =>
            source['modifiers'].flatMap(modifier =>
                modifier['effects'].filter(effect => effect['identifier'] === identifier)
            )
        );

    }
    private _applyEffects(base: number, identifier: string): number {

        const effects = this._getEffects(identifier);

        let value = base;
        value += effects.filter(e => e['kind'] === 'adder').reduce((sum, e) => sum + e['value'], 0);
        value *= effects.filter(e => e['kind'] === 'multiplier').reduce((product, e) => product * e['value'], 1);
        const setters = effects.filter(e => e['kind'] === 'setter');
        if (setters.length > 0) value = Math.min(...setters.map(e => e['value']));

        return value;

    }
    public getAttributeValue(attribute: string): number {

        const base = this['constellation']['current'][attribute] ?? 0;
        return this._applyEffects(base, attribute);

    }
    public getSkillValue(skill: string): number {

        const base = this['scroll']['current'][skill]['level'] ?? 0;
        return this._applyEffects(base, skill);

    }
    public getMaxConditionValue(condition: string): number {

        const config = CONDITIONS.find(c => c['identifier'] === condition);
        if (!config) return 0;

        const base = config['base-value'] + config['rate'] * config['dependencies'].reduce(
            (sum, dep) => sum + this.getAttributeValue(dep), 0
        );

        return this._applyEffects(base, condition);

    }

}


export default Character;