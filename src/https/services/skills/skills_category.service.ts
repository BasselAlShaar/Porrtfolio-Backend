import skills_categoryRepository from "../../repositories/skills/skills_category.repository.js";

import type {
    CreateSkillsCategoryData,
    UpdateSkillsCategoryData
} from "../../../types/skill_category.js"

//get all
const getAllSkillCategories = async () => {
    return skills_categoryRepository.find_all();
};

//create
const createSkillCategory = async (data: CreateSkillsCategoryData) => {
    return skills_categoryRepository.create(data);
}

//find by id
const findSkillCategoryById = async (id: string) => {
    return skills_categoryRepository.findById(id);
}

//update
const updateSkillCategory = async (
    id: string,
    data: UpdateSkillsCategoryData
) => {
    const existingSkillCategory =
        await skills_categoryRepository.findById(id);
    
    if (!existingSkillCategory) {
        return null;
    }

    return skills_categoryRepository.update(id, data);
};

//delete
const deleteSkillCategory = async (id: string) => {

    const existingSkillCategory = await skills_categoryRepository.findById(id);

    if(!existingSkillCategory) {
        return null;
    }

    return skills_categoryRepository.delete(id);
};

export default {
    getAllSkillCategories,
    findSkillCategoryById,
    createSkillCategory,
    updateSkillCategory,
    deleteSkillCategory
}