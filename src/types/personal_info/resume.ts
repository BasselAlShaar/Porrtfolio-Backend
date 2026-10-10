export interface ResumesData {
    title: string;
    file_storage_key: string;
    file_name?: string | null;
    version?: string | null;
    is_active: boolean;
    display_order: number;
}

export type CreateResumeData = ResumesData;

export type UpdateResumeData = Omit<Partial<ResumesData>, "file_storage_key">;