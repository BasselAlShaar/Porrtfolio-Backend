import projectRepository from "../../repositories/project/project.repository.js";

import type {
    ProjectStatus,
    CreateProjectData,
    UpdateProjectData,
    CreateProjectRequestData,
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
    data: CreateProjectRequestData,
    files: Express.Multer.File[]
) => {
    validateProjectDates(
        data.start_date,
        data.end_date,
        data.status
    );

    if (!files.length) {
        throw new Error("At least one image is required.");
    }

    const metadata = data.images_metadata;

    if (!Array.isArray(metadata) || metadata.length !== files.length) {
        throw new Error(
            "Each uploaded image must have exactly one metadata entry."
        );
    }

    const usedIndexes = new Set<number>();

    for (const item of metadata) {
        if (
            !Number.isInteger(item.file_index) ||
            item.file_index < 0 ||
            item.file_index >= files.length
        ) {
            throw new Error("Invalid image file_index.");
        }

        if (usedIndexes.has(item.file_index)) {
            throw new Error("Duplicate image file_index.");
        }

        usedIndexes.add(item.file_index);

        if (
            typeof item.image_type !== "string" ||
            !item.image_type.trim()
        ) {
            throw new Error("Every image must have an image_type.");
        }

        if (
            !Number.isInteger(item.display_order) ||
            item.display_order < 0
        ) {
            throw new Error("Invalid image display_order.");
        }
    }

    const projectId = randomUUID();
    const savedKeys: string[] = [];

    try {
        const images = await Promise.all(
            metadata.map(async (item) => {
                const file = files[item.file_index];
                const optimized = await optimizeImage(file!.buffer);
                const filename = `${randomUUID()}.webp`;

                const storageKey = await saveFile(
                    optimized.buffer,
                    `projects/${projectId}`,
                    filename
                );

                savedKeys.push(storageKey);

                return {
                    project_id: projectId,
                    image_storage_key: storageKey,
                    alt_text: item.alt_text,
                    caption: item.caption,
                    image_type: item.image_type,
                    display_order: item.display_order,
                };
            })
        );

        const projectData: CreateProjectData = {
            ...data,
            id: projectId,
            images,
        };

        // Do not pass request-only metadata into the repository.
        delete (projectData as CreateProjectData & {
            images_metadata?: unknown;
        }).images_metadata;

        const result = await projectRepository.create(projectData);

        if (!result) {
            throw new Error("Project creation failed.");
        }

        return result;
    } catch (error) {
        await Promise.allSettled(
            savedKeys.map((key) => deleteFile(key))
        );

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

const deleteProject = async (slug: string) => {
    const project = await projectRepository.getProjectId(slug);

    if (!project) {
        return null;
    }

    const result = await projectRepository.delete(slug);

    if (!result) {
        return null;
    }

    await deleteFolder(`projects/${project}`);

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