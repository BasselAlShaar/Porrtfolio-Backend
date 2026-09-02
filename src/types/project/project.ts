import type { CreateTechnologiesData } from "../technologies/technologies.js";
import type { CreateSkillsData } from "../skills/skills.js";

import type { CreateProjectLinksData } from "./project_links.js";
import type { CreateProjectImagesData } from "./project_images.js";
import type { CreateProjectFeaturesData } from "./project_features.js";
import type { CreateProjectChallengesData } from "./project_challenges.js";

export type ProjectStatus = "archived" | "in_progress" | "completed";

export type ProjectType = "personal" | "academic" | "professional" | "freelance" | "open_source" | "game"| "other" | null;

export interface ProjectData {
    title: string;
    slug: string;
    short_description: string;
    description?: string | null;
    role?: string | null;
    problem?: string | null;
    solution?: string | null;
    project_type?: ProjectType;
    status: ProjectStatus;
    start_date: string;
    end_date: string | null;
    featured: boolean;
    display_order: number;
}

export interface CreateProjectData extends ProjectData {
    technologies?: string[];
    skills?: string[];
    links?: CreateProjectLinksData[];
    images?: CreateProjectImagesData[];
    features?: CreateProjectFeaturesData[];
    challenges?: CreateProjectChallengesData[];
}

export type UpdateProjectData = Partial<ProjectData>;