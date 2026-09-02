import projectRepository from "../../repositories/project/project.repository.js";

import type {
    ProjectStatus,
    CreateProjectData,
    UpdateProjectData,
} from "../../../types/project/project.js";

const validateProjectDates = (
    startDate: string,
    endDate: string | null | undefined,
    status: ProjectStatus
): void => {
    const start = new Date(startDate);

    if (Number.isNaN(start.getTime())) {
        throw new Error("Invalid start date.");
    }

    if (endDate !== null && endDate !== undefined) {
        const end = new Date(endDate);

        if (Number.isNaN(end.getTime())) {
            throw new Error("Invalid end date.");
        }

        if (start > end) {
            throw new Error("Start date cannot be after end date.");
        }
    }

    if (status !== "completed" && endDate !== null && endDate !== undefined) {
        throw new Error("Not completed projects cannot have an end date.");
    }

    if (status === "completed"  && (endDate === null || endDate === undefined)) {
        throw new Error("Project that is completed must have an end date.");
    }
};

//public
//get all
const getAllProjectsPublic = async () => {
    return projectRepository.find_all_public_card();
}

//get one
const getProjectBySlugPublic = async (slug: string) => {
    return projectRepository.get_one_public(slug);
}

//admin
//get all
const getAllProjects = async () => {
    return projectRepository.find_all_card();
}

//get one
const getProjectBySlug = async (slug: string) => {
    return projectRepository.getBySlug(slug);
}

//create
const createProject = async (
    data: CreateProjectData
) => {
    validateProjectDates(
        data.start_date,
        data.end_date,
        data.status
    );
    return projectRepository.create(data);
};

const updateProject = async (
    slug: string,
    data: UpdateProjectData
) => {
    const existingProject = await projectRepository.getBySlug(slug);

    if (!existingProject) {
        return null;
    }

    const startDate =
        data.start_date !== undefined
            ? data.start_date
            : existingProject.start_date;

    const endDate =
        data.end_date !== undefined
            ? data.end_date
            : existingProject.end_date;

    const status =
        data.status !== undefined
            ? data.status
            : existingProject.status;

    validateProjectDates(
        startDate,
        endDate,
        status
    );

    return projectRepository.update(slug, data);
}

const deleteProject = async (slug: string) => {
    const existingProject = await projectRepository.getBySlug(slug);

    if (!existingProject) {
        return null;
    }

    return projectRepository.delete(slug);
}

export default {
    getAllProjectsPublic,
    getProjectBySlugPublic,
    getAllProjects,
    getProjectBySlug,
    createProject,
    updateProject,
    deleteProject,
};