import projectRepository from "../../repositories/project/project.repository.js";

import type {
    ProjectStatus,
    CreateProjectData,
    UpdateProjectData,
} from "../../../types/project/project.js";
import optimizeImage from "../image_optimizer.js";
import { randomUUID } from "node:crypto";
import { saveFile, deleteFile, getFilePath, deleteFolder } from "../file_storage.js";

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
    const projects =
        await projectRepository.find_all_public_card();

    return projects.map((project) => ({
        title: project.title,
        slug: project.slug,
        short_description: project.short_description,
        project_type: project.project_type,
        status: project.status,
        featured: project.featured,

        images: project.images.map((image: any) => ({
            id: image.id,
            alt_text: image.alt_text,
            caption: image.caption,
            image_type: image.image_type,
            url: `/api/v1/project-images/${image.id}/file`,
        })),
    }));
};

//get one
const getProjectBySlugPublic = async (slug: string) => {
    const project =
        await projectRepository.get_one_public(slug);

    if (!project) {
        return null;
    }

    return {
        ...project,

        images: project.images.map((image: any) => ({
            id: image.id,
            alt_text: image.alt_text,
            caption: image.caption,
            image_type: image.image_type,
            url: `/api/v1/project-images/${image.id}/file`,
        })),
    };
}

//admin
//get all
const getAllProjects = async () => {
    const projects =
        await projectRepository.find_all_card();

    return projects.map((project) => ({
        id: project.id,
        title: project.title,
        slug: project.slug,
        short_description: project.short_description,
        project_type: project.project_type,
        status: project.status,
        featured: project.featured,
        display_order: project.display_order,

        images: project.images.map((image: any) => ({
            id: image.id,
            alt_text: image.alt_text,
            caption: image.caption,
            image_type: image.image_type,
            url: `/api/v1/project-images/${image.id}/file`,
        })),
    }));
}

//get one
const getProjectBySlug = async (slug: string) => {
    const project =
        await projectRepository.getBySlug(slug);

    if (!project) {
        return null;
    }

    return {
        ...project,

        images: project.images.map((image: any) => ({
            id: image.id,
            alt_text: image.alt_text,
            caption: image.caption,
            image_type: image.image_type,
            display_order: image.display_order,
            url: `/api/v1/project-images/${image.id}/file`,
        })),
    };
}

//create
const createProject = async (
    data: CreateProjectData,
    file: Express.Multer.File
) => {
    validateProjectDates(
        data.start_date,
        data.end_date,
        data.status
    );

    const projectId = randomUUID();

    const optimized = await optimizeImage(file.buffer);

    const filename = `${randomUUID()}.webp`;

    const storageKey = await saveFile(
        optimized.buffer,
        `projects/${projectId}`,
        filename
    );

    try {
        const result = await projectRepository.create({
            ...data,
            id: projectId,
            images: [
                {
                    project_id: projectId,
                    image_storage_key: storageKey,
                    alt_text: null,
                    caption: null,
                    image_type: "main",
                    display_order: 0,
                },
            ],
        });

        if (!result) {
            await deleteFile(storageKey);
            return null;
        }

        return result;
    } catch (error) {
        await deleteFile(storageKey);
        throw error;
    }
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

const deleteProject = async (id: string) => {
    const project = await projectRepository.getBySlug(id);

    if (!project) {
        return null;
    }

    const result = await projectRepository.delete(id);

    if (!result) {
        return null;
    }

    await deleteFolder(`projects/${id}`);

    return result;
};

export default {
    getAllProjectsPublic,
    getProjectBySlugPublic,
    getAllProjects,
    getProjectBySlug,
    createProject,
    updateProject,
    deleteProject,
};