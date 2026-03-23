// backend/entry/character/scroll.ts


export const SKILLS = [
    'bone-medicine',
    'blood-medicine',
    'nerves-medicine',

    'pyrotechnics-alchemy',
    'elixirs-alchemy',
    'oils-alchemy',

    'smith-craft',
    'engineer-craft',
    'tinker-craft',

    'comedy-art', 
    'tragedy-art', 
    'epic-art', 
    'lyric-art',

    'hammer-brawl', 
    'fist-brawl', 
    'rod-brawl',
    'axe-brawl', 
    'sword-brawl', 
    'halberd-brawl',
    'spear-brawl', 
    'dagger-brawl', 
    'bow-brawl'
] as const;
export const SKILL_LEVEL_EXPERIENCE_REQUIREMENT = [
    100, 200, 500, 1000
]
export const MAX_SKILL_LEVEL = SKILL_LEVEL_EXPERIENCE_REQUIREMENT.length;
const DEFAULT_SCROLL = Object.fromEntries(
    SKILLS.map(skill => [skill, { level: 0, experience: 0 }])
) as Record<string, { level: number, experience: number }>;

export class Scroll {

    public ['current']: typeof DEFAULT_SCROLL;

    constructor(source?: typeof DEFAULT_SCROLL) {

        this['current'] = { ...DEFAULT_SCROLL, ...source };

    }
    
    public adjustExperience(skillIdentifier: string, value: number, mode: 'set' | 'add'): boolean {

        if (!(skillIdentifier in this['current'])) return false;

        if (this['current'][skillIdentifier]['level']===MAX_SKILL_LEVEL) return true;

        if (mode==='add') this['current'][skillIdentifier]['experience'] += value;
        if (mode==='set') this['current'][skillIdentifier]['experience'] = value;
        while (this['current'][skillIdentifier]['level']<MAX_SKILL_LEVEL && this['current'][skillIdentifier]['experience'] >= SKILL_LEVEL_EXPERIENCE_REQUIREMENT[this['current'][skillIdentifier]['level']]) {
            this['current'][skillIdentifier]['experience'] -= SKILL_LEVEL_EXPERIENCE_REQUIREMENT[this['current'][skillIdentifier]['level']];
            this['current'][skillIdentifier]['level']++;
        }
        return true;

    }

    public practiceLevel(skillIdentifier: string, value: number, mode: 'add' | 'set') {

        if (!(skillIdentifier in this['current'])) return false;
        
        if (mode==='add') this['current'][skillIdentifier]['level'] += value;
        if (mode==='set') this['current'][skillIdentifier]['level'] = value;
        if (this['current'][skillIdentifier]['level']>=MAX_SKILL_LEVEL) {
            this['current'][skillIdentifier]['level']=MAX_SKILL_LEVEL;
            this['current'][skillIdentifier]['experience']=0;
        }
        return true;

    }

}


export default Scroll