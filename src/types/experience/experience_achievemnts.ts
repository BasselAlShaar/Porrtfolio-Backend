export interface ExperienceAchievementsData {
    experience_id: string;
    title: string;
    description: string | null;
    display_order: number;
}

export type CreateExperienceAchievementsData = ExperienceAchievementsData;

export type UpdateExperienceAchievementsData = {
    title?: string | null;
    description: string | null;
    display_order?: number | null;
}