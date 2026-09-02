export interface SkillsCategoryData {
    name: string;
    description?: string | null;
    display_order: number
}

export type CreateSkillsCategoryData = SkillsCategoryData;

export type UpdateSkillsCategoryData = Partial<SkillsCategoryData>;