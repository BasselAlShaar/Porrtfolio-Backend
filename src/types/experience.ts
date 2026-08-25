export interface ExperienceData {
    company_name: string;
    company_url?: string | null;
    position: string;
    employment_type?: string | null;
    location?: string | null;
    description?: string | null;
    start_date: string;
    end_date?: string | null;
    is_current: boolean;
    display_order: number;
}

export type CreateExperienceData = ExperienceData;

export type UpdateExperienceData = Partial<ExperienceData>;