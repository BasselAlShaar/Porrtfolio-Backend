import project_imagesRepository from "../../repositories/project/project_images.repository.js";

import type {
    CreateProjectImagesData,
    UpdateProjectImagesData,
} from "../../../types/project/project_images.js";

//get all
const getAllProjectImages = async (id: string) => {
    return project_imagesRepository.find_all(id);
}

//get one
const getProjectImageById = async (id: string) => {
    return project_imagesRepository.getById(id);
}

//create
const createProjectImage = async (
    data: CreateProjectImagesData
) => {
    return project_imagesRepository.create(data);
};

const updateProjectImage = async (
    id: string,
    data: UpdateProjectImagesData
) => {
    const existingProjectImage = await project_imagesRepository.getById(id);

    if (!existingProjectImage) {
        return null;
    }

    return project_imagesRepository.update(id, data);
}

const deleteProjectImage = async (id: string) => {
    const existingProjectImage = await project_imagesRepository.getById(id);

    if (!existingProjectImage) {
        return null;
    }

    return project_imagesRepository.delete(id);
}

export default {
    getAllProjectImages,
    getProjectImageById,
    createProjectImage,
    updateProjectImage,
    deleteProjectImage
};