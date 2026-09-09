export interface ProjectImagesData {
    project_id: string;
    image_storage_key: string;
    alt_text?: string | null;
    caption?: string | null;
    image_type: string;
    display_order: number;
}

export type CreateProjectImagesData = ProjectImagesData;

export type UpdateProjectImagesData = Omit<Partial<ProjectImagesData>, "project_id" | "image_storage_key">