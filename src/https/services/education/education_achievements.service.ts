import education_achievementsRepository from "../../repositories/education/education_achievements.repository.js";

import type { 
    CreateEducationAchievementsData,
    UpdateEducationAchievementsData
} from "../../../types/education_achievements.js";

//get all
const getAllEducationAchievements = async (id: string) => {
    return education_achievementsRepository.find_all(id);
}

//get one
const getEducationAchievementById = async (id: string) => {
    return education_achievementsRepository.getById(id);
}

//create
const createEducationAchievement = async (
    data: CreateEducationAchievementsData
) => {
    return education_achievementsRepository.create(data);
}

//update
const updateEducationAchievement = async (
    id: string,
    data: UpdateEducationAchievementsData
) => {
    const result = await education_achievementsRepository.getById(id);

    if (!result) {
        return null;
    }

    return education_achievementsRepository.update(id, data);
}

//delete
const deleteEducationAchievement = async (id: string) => {
    const result = await education_achievementsRepository.getById(id);

    if (!result) {
        return null;
    }

    return education_achievementsRepository.delete(id);
}

export default {
    getAllEducationAchievements,
    getEducationAchievementById,
    createEducationAchievement,
    updateEducationAchievement,
    deleteEducationAchievement
}