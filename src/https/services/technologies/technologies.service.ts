import technologiesRepository from "../../repositories/technologies/technologies.repository.js";

import type {
    CreateTechnologiesData,
    UpdateTechnologiesData
} from "../../../types/technologies/technologies.js"

//public
//get all
const getAllTechnologiesPublic = async () => {
    return technologiesRepository.find_all_public();
}

//admin
//get all
const getAllTechnologies = async () => {
    return technologiesRepository.find_all();
};

//create
const createTechnology = async (data: CreateTechnologiesData) => {
    return technologiesRepository.create(data);
}

//find by id
const findTechnologyById = async (id: string) => {
    return technologiesRepository.findById(id);
}

//update
const updateTechnology = async (
    id: string,
    data: UpdateTechnologiesData
) => {
    const existingTechnology =
        await technologiesRepository.findById(id);
    
    if (!existingTechnology) {
        return null;
    }

    return technologiesRepository.update(id, data);
};

//delete
const deleteTechnology = async (id: string) => {

    const existingTechnology = await technologiesRepository.findById(id);

    if(!existingTechnology) {
        return null;
    }

    return technologiesRepository.delete(id);
};

export default {
    getAllTechnologiesPublic,
    getAllTechnologies,
    findTechnologyById,
    createTechnology,
    updateTechnology,
    deleteTechnology
}