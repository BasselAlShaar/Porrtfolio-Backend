export interface EducationAchievementsData {
    education_id: string;
    title: string;
    description: string | null;
    display_order: number;
}

export type CreateEducationAchievementsData = EducationAchievementsData;

export type UpdateEducationAchievementsData = Partial<EducationAchievementsData>;