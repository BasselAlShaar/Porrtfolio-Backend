export interface ProjectImagesData {
    project_id: string;
    image_url: string;
    alt_text?: string | null;
    caption?: string | null;
    image_type: string;
    display_order: string;
}

export type CreateProjectImagesData = ProjectImagesData;

export type UpdateProjectImagesData = Omit<Partial<ProjectImagesData>, "project_id">