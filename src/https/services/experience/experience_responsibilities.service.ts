import experience_responsibilitiesRepository from "../../repositories/experience/experience_responsibilities.repository.js";

import type { 
    CreateExperienceResponsibilitiesData,
    UpdateExperienceResponsibilitiesData
} from "../../../types//experience/experience_responsibilities.js";

//get all
const getAllExperienceResponsibilities = async (id: string) => {
    return experience_responsibilitiesRepository.find_all(id);
}

//get one
const getExperienceResponsibilityById = async (id: string) => {
    return experience_responsibilitiesRepository.getById(id);
}

//create
const createExperienceResponsibility = async (
    data: CreateExperienceResponsibilitiesData
) => {
    return experience_responsibilitiesRepository.create(data);
}

//update
const updateExperienceResponsibility = async (
    id: string,
    data: UpdateExperienceResponsibilitiesData
) => {
    const result = await experience_responsibilitiesRepository.getById(id);

    if (!result) {
        return null;
    }

    return experience_responsibilitiesRepository.update(id, data);
}

//delete
const deleteExperienceResponsibility = async (id: string) => {
    const result = await experience_responsibilitiesRepository.getById(id);

    if (!result) {
        return null;
    }

    return experience_responsibilitiesRepository.delete(id);
}

export default {
    getAllExperienceResponsibilities,
    getExperienceResponsibilityById,
    createExperienceResponsibility,
    updateExperienceResponsibility,
    deleteExperienceResponsibility
}