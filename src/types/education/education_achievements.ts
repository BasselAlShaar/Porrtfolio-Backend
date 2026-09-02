export interface EducationAchievementsData {
    education_id: string;
    title: string;
    description: string | null;
    display_order: number;
}

export type CreateEducationAchievementsData = EducationAchievementsData;

export type UpdateEducationAchievementsData = {
    title?: string | null;
    description: string | null;
    display_order?: number | null;
}