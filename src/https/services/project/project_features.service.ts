import project_featuresRepository from "../../repositories/project/project_features.repository.js";

import type {
    CreateProjectFeaturesData,
    UpdateProjectFeaturesData,
} from "../../../types/project/project_features.js";

//get all
const getAllProjectFeatures = async (id: string) => {
    return project_featuresRepository.find_all(id);
}

//get one
const getProjectFeatureById = async (id: string) => {
    return project_featuresRepository.getById(id);
}

//create
const createProjectFeature = async (
    data: CreateProjectFeaturesData
) => {
    return project_featuresRepository.create(data);
};

const updateProjectFeature = async (
    id: string,
    data: UpdateProjectFeaturesData
) => {
    const existingProjectFeature = await project_featuresRepository.getById(id);

    if (!existingProjectFeature) {
        return null;
    }

    return project_featuresRepository.update(id, data);
}

const deleteProjectFeature = async (id: string) => {
    const existingProjectFeature = await project_featuresRepository.getById(id);

    if (!existingProjectFeature) {
        return null;
    }

    return project_featuresRepository.delete(id);
}

export default {
    getAllProjectFeatures,
    getProjectFeatureById,
    createProjectFeature,
    updateProjectFeature,
    deleteProjectFeature
};