import type { CreateTechnologiesData } from "../technologies/technologies.js";
import type { CreateSkillsData } from "../skills/skills.js";

import type { CreateProjectLinksData } from "./project_links.js";
import type { CreateProjectImagesData } from "./project_Images.js";
import type { CreateProjectFeaturesData } from "./project_features.js";
import type { CreateProjectChallengesData } from "./project_challenges.js";

export interface ProjectData {
    title: string;
    slug: string;
    short_description: string;
    description?: string | null;
    role?: string | null;
    problem?: string | null;
    solution?: string | null;
    project_type?: string | null;
    status: string;
    start_date: string;
    end_date: string | null;
    featured: boolean;
    display_order: number;
}

export interface CreateProjectData extends ProjectData {
    technologies?: CreateTechnologiesData[];
    skills?: CreateSkillsData[];
    links?: CreateProjectLinksData[];
    images?: CreateProjectImagesData[];
    features?: CreateProjectFeaturesData[];
    challenges?: CreateProjectChallengesData[];
}

export type UpdateProjectData = Partial<ProjectData>;