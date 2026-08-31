import experience_achievementsRepository from "../../repositories/experience/experience_achievements.repository.js";

import type { 
    CreateExperienceAchievementsData,
    UpdateExperienceAchievementsData
} from "../../../types//experience/experience_achievemnts.js";

//get all
const getAllExperienceAchievements = async (id: string) => {
    return experience_achievementsRepository.find_all(id);
}

//get one
const getExperienceAchievementById = async (id: string) => {
    return experience_achievementsRepository.getById(id);
}

//create
const createExperienceAchievement = async (
    data: CreateExperienceAchievementsData
) => {
    return experience_achievementsRepository.create(data);
}

//update
const updateExperienceAchievement = async (
    id: string,
    data: UpdateExperienceAchievementsData
) => {
    const result = await experience_achievementsRepository.getById(id);

    if (!result) {
        return null;
    }

    return experience_achievementsRepository.update(id, data);
}

//delete
const deleteExperienceAchievement = async (id: string) => {
    const result = await experience_achievementsRepository.getById(id);

    if (!result) {
        return null;
    }

    return experience_achievementsRepository.delete(id);
}

export default {
    getAllExperienceAchievements,
    getExperienceAchievementById,
    createExperienceAchievement,
    updateExperienceAchievement,
    deleteExperienceAchievement
}