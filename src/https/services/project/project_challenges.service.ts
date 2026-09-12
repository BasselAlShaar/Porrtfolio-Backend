import project_ChallengesRepository from "../../repositories/project/project_challenges.repository.js";
import projectRepository from "../../repositories/project/project.repository.js";

import type {
    CreateProjectChallengesData,
    UpdateProjectChallengesData,
} from "../../../types/project/project_challenges.js";

//get all
const getAllProjectChallenges = async (slug: string) => {
    return project_ChallengesRepository.find_all(slug);
}

//get one
const getProjectChallengeById = async (id: string) => {
    return project_ChallengesRepository.getById(id);
}

//create
const createProjectChallenge = async (
    slug: string,
    data: CreateProjectChallengesData
) => {

    const project_id = await projectRepository.getProjectId(slug);

    return project_ChallengesRepository.create(project_id, data);
};

const updateProjectChallenge = async (
    id: string,
    data: UpdateProjectChallengesData
) => {
    const existingProjectChallenge = await project_ChallengesRepository.getById(id);

    if (!existingProjectChallenge) {
        return null;
    }

    return project_ChallengesRepository.update(id, data);
}

const deleteProjectChallenge = async (id: string) => {
    const existingProjectChallenge = await project_ChallengesRepository.getById(id);

    if (!existingProjectChallenge) {
        return null;
    }

    return project_ChallengesRepository.delete(id);
}

export default {
    getAllProjectChallenges,
    getProjectChallengeById,
    createProjectChallenge,
    updateProjectChallenge,
    deleteProjectChallenge
};