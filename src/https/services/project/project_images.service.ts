import { randomUUID } from "node:crypto";

import optimizeImage from "../image_optimizer.js";
import { deleteFile, saveFile, getFilePath } from "../file_storage.js";

import project_imagesRepository from "../../repositories/project/project_images.repository.js";

import type {
    CreateProjectImagesData,
    UpdateProjectImagesData,
} from "../../../types/project/project_images.js";

const getAllProjectImages = async (slug: string) => {
    const images =
        await project_imagesRepository.find_all(slug);

    return images.map((image) => ({
        id: image.id,
        project_id: image.project_id,
        alt_text: image.alt_text,
        caption: image.caption,
        image_type: image.image_type,
        display_order: image.display_order,
        url: `/api/v1/project-images/${image.id}/file`,
    }));
};

// Get one project image
const getProjectImageById = async (id: string) => {
    const image =
        await project_imagesRepository.getById(id);

    if (!image) {
        return null;
    }

    return {
        id: image.id,
        project_id: image.project_id,
        alt_text: image.alt_text,
        caption: image.caption,
        image_type: image.image_type,
        display_order: image.display_order,
        url: `/api/v1/project-images/${image.id}/file`,
    };
};

const getProjectImageFile = async (id: string) => {
    const image =
        await project_imagesRepository.getById(id);

    if (!image) {
        return null;
    }

    return getFilePath(
        image.image_storage_key
    );
};

// Create project image
const createProjectImage = async (
    file: Express.Multer.File,
    data: CreateProjectImagesData
) => {
    const optimized = await optimizeImage(file.buffer);

    const filename = `${randomUUID()}.webp`;

    const storageKey = await saveFile(
        optimized.buffer,
        `projects/${data.project_id}`,
        filename
    );

    try {
        data.image_storage_key = storageKey;

        return await project_imagesRepository.create(data);
    } catch (error) {
        await deleteFile(storageKey);

        throw error;
    }
};

// Update project image metadata
const updateProjectImageData = async (
    id: string,
    data: UpdateProjectImagesData
) => {
    const existingProjectImage =
        await project_imagesRepository.getById(id);

    if (!existingProjectImage) {
        return null;
    }

    return project_imagesRepository.update(id, data);
};

// Replace project image
const updateProjectImage = async (
    id: string,
    file: Express.Multer.File
) => {
    const existingProjectImage =
        await project_imagesRepository.getById(id);

    if (!existingProjectImage) {
        return null;
    }

    const optimized = await optimizeImage(file.buffer);

    const filename = `${randomUUID()}.webp`;

    const storageKey = await saveFile(
        optimized.buffer,
        `projects/${existingProjectImage.project_id}`,
        filename
    );

    try {
        const result =
            await project_imagesRepository.updateStorageKey(
                id,
                storageKey
            );

        if (!result) {
            await deleteFile(storageKey);
            return null;
        }

        await deleteFile(
            existingProjectImage.image_storage_key
        );

        return result;
    } catch (error) {
        await deleteFile(storageKey);

        throw error;
    }
};

// Delete project image
const deleteProjectImage = async (id: string) => {
    const existingProjectImage =
        await project_imagesRepository.getById(id);

    if (!existingProjectImage) {
        return null;
    }

    const result =
        await project_imagesRepository.delete(id);

    if (!result) {
        return null;
    }

    await deleteFile(
        existingProjectImage.image_storage_key
    );

    return result;
};

export default {
    getAllProjectImages,
    getProjectImageById,
    getProjectImageFile,
    createProjectImage,
    updateProjectImageData,
    updateProjectImage,
    deleteProjectImage,
};