export interface ProjectLinksData {
    project_id: string;
    link_type: string;
    label?: string | null;
    url: string;
    display_order: string;
}

export type CreateProjectLinksData = ProjectLinksData;

export type UpdateProjectLinksData = Omit<Partial<ProjectLinksData>, "project_id">