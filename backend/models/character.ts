// backend/models/character.ts


import { Entry } from "./entry";


const mapping: Record<string, string[]> = {
    'flesh': ['constitution', 'breath', 'agility', 'strength', 'dexterity', 'shivers'],
    'psyche': ['drama', 'rhetoric', 'threat', 'grace', 'melody', 'empathy'],
    'intellect': ['erudition', 'clinic', 'pharmacy', 'artifice', 'composure', 'insight']
};

export class Character extends Entry {
    
    public 'paths': Record<string, number> = {};
    public 'attributes': Record<string, { 'parent-path': string, 'level': number }> = {};

    constructor(source?: any) {

        super(source);
        this['category'] = 'character';

        for (const [path, attributes] of Object.entries(mapping)) {
            this['paths'][path] = (source && source['paths']) ? 
                source['paths'][path] : 0;

            for (const attribute of attributes) {
                this['attributes'][attribute] = (source && source['attributes'] && source['attributes'][attribute]) ?
                    { ...source['attributes'][attribute] } : { 'parent-path': path, 'level': 0 };
            }
        }

    }   
}


export default Character;