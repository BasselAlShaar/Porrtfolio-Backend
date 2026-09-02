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

export interface CreateEducationData extends EducationData {
    achievements?: CreateEducationAchievementData[];
}

export interface CreateEducationAchievementData {

    // Short title for the achievement.
    title: string;

    // Optional additional context.
    description?: string | null;

    // Controls display order.
    display_order: number;
}

export type UpdateEducationData = Partial<EducationData>;

export type UpdateEducationAchievementData = Partial<CreateEducationAchievementData>;