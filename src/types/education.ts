export interface EducationData {
    institution_name: string;
    institution_url?: string | null;
    degree: string;
    field_of_study?: string | null;
    description?: string | null;
    location?: string | null;
    start_date: string;
    end_date?: string | null;
    is_current: boolean;
    display_order: number;
}

export type CreateEducationData = EducationData;

export type UpdateEducationData = Partial<EducationData>;