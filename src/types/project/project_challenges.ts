export interface ProjectChallengesData {
    project_id: string;
    title: string;
    description?: string | null;
    solution?: string | null;
    display_order: string;
}

export type CreateProjectChallengesData = ProjectChallengesData;

export type UpdateProjectChallengesData = Omit<Partial<ProjectChallengesData>, "project_id">