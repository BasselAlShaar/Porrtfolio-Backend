export interface ProjectFeaturesData {
    project_id: string;
    title: string;
    description?: string | null;
    display_order: string;
}

export type CreateProjectFeaturesData = ProjectFeaturesData;

export type UpdateProjectFeaturesData = Omit<Partial<ProjectFeaturesData>, "project_id">