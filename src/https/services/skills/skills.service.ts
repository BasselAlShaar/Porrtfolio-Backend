import skillsRepository from "../../repositories/skills/skills.repository.js";

import type {
    CreateSkillsData,
    UpdateSkillsData
} from "../../../types/skills.js"

//public
//get all
const getAllSkillsPublic = async () => {
    return skillsRepository.find_all_public();
}

//admin
//get all
const getAllSkills = async () => {
    return skillsRepository.find_all();
};

//create
const createSkill = async (data: CreateSkillsData) => {
    return skillsRepository.create(data);
}

//find by id
const findSkillById = async (id: string) => {
    return skillsRepository.findById(id);
}

//update
const updateSkill = async (
    id: string,
    data: UpdateSkillsData
) => {
    const existingSkill =
        await skillsRepository.findById(id);
    
    if (!existingSkill) {
        return null;
    }

    return skillsRepository.update(id, data);
};

//delete
const deleteSkill = async (id: string) => {

    const existingSkill = await skillsRepository.findById(id);

    if(!existingSkill) {
        return null;
    }

    return skillsRepository.delete(id);
};

export default {
    getAllSkillsPublic,
    getAllSkills,
    findSkillById,
    createSkill,
    updateSkill,
    deleteSkill
}