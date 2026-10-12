import type { CreateTechnologiesData } from "../technologies/technologies.js";
import type { CreateSkillsData } from "../skills/skills.js";

import type { CreateProjectLinksData } from "./project_links.js";
import type { CreateProjectImagesData } from "./project_images.js";
import type { CreateProjectFeaturesData } from "./project_features.js";
import type { CreateProjectChallengesData } from "./project_challenges.js";

export type ProjectStatus = "archived" | "in_progress" | "completed";

export type ProjectType = "personal" | "academic" | "professional" | "freelance" | "open_source" | "game"| "other" | null;

export interface ProjectData {
    id: string;
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

export interface CreateProjectImageMetadata {
    file_index: number;
    alt_text: string | null;
    caption: string | null;
    image_type: string;
    display_order: number;
}

export type CreateProjectRequestData =
    Omit<CreateProjectData, "images"> & {
        images_metadata: CreateProjectImageMetadata[];
    };

export interface CreateProjectData extends ProjectData {
    technologies?: string[];
    skills?: string[];
    links?: CreateProjectLinksData[];
    images?: CreateProjectImagesData[];
    features?: CreateProjectFeaturesData[];
    challenges?: CreateProjectChallengesData[];
}

export type UpdateProjectData = Omit<Partial<ProjectData>, "id">;