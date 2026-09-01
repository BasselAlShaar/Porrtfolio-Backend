export interface ExperienceResponsibilitiesData {
    experience_id: string;
    title: string;
    description: string | null;
    display_order: number;
}

export type CreateExperienceResponsibilitiesData = ExperienceResponsibilitiesData;

export type UpdateExperienceResponsibilitiesData = {
    title?: string | null;
    description: string | null;
    display_order?: number | null;
}