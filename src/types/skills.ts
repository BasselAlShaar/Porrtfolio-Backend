export interface SkillsData {
    name: string;
    description?: string | null;
    icon?: string | null;
    display_order: number
}

export type CreateSkillsData = SkillsData;

export type UpdateSkillsData = Partial<SkillsData>;