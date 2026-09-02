import project_linksRepository from "../../repositories/project/project_links.repository.js";

import type {
    CreateProjectLinksData,
    UpdateProjectLinksData,
} from "../../../types/project/project_links.js";

//get all
const getAllProjectLinks = async (id: string) => {
    return project_linksRepository.find_all(id);
}

//get one
const getProjectLinkById = async (id: string) => {
    return project_linksRepository.getById(id);
}

//create
const createProjectLink = async (
    data: CreateProjectLinksData
) => {
    return project_linksRepository.create(data);
};

const updateProjectLink = async (
    id: string,
    data: UpdateProjectLinksData
) => {
    const existingProjectLink = await project_linksRepository.getById(id);

    if (!existingProjectLink) {
        return null;
    }

    return project_linksRepository.update(id, data);
}

const deleteProjectLink = async (id: string) => {
    const existingProjectLink = await project_linksRepository.getById(id);

    if (!existingProjectLink) {
        return null;
    }

    return project_linksRepository.delete(id);
}

export default {
    getAllProjectLinks,
    getProjectLinkById,
    createProjectLink,
    updateProjectLink,
    deleteProjectLink
};