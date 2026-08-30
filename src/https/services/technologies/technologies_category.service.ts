import technologies_categoryRepository from "../../repositories/technologies/technologies_category.repository.js";

import type {
    CreateTechnologiesCategoryData,
    UpdateTechnologiesCategoryData
} from "../../../types/technologies/technologies_category.js"

//public
//get all
const getAllTechnologiesCategoriesPublic = async () => {
    return technologies_categoryRepository.find_all_public();
}

//admin
//get all
const getAllTechnologyCategories = async () => {
    return technologies_categoryRepository.find_all();
};

//create
const createTechnologyCategory = async (data: CreateTechnologiesCategoryData) => {
    return technologies_categoryRepository.create(data);
}

//find by id
const findTechnologyCategoryById = async (id: string) => {
    return technologies_categoryRepository.findById(id);
}

//update
const updateTechnologyCategory = async (
    id: string,
    data: UpdateTechnologiesCategoryData
) => {
    const existingTechnologyCategory =
        await technologies_categoryRepository.findById(id);
    
    if (!existingTechnologyCategory) {
        return null;
    }

    return technologies_categoryRepository.update(id, data);
};

//delete
const deleteTechnologyCategory = async (id: string) => {

    const existingTechnologyCategory = await technologies_categoryRepository.findById(id);

    if (!existingTechnologyCategory) {
        return null;
    }

    const TechnologyCount = await technologies_categoryRepository.countTechnologies(id);

    if (TechnologyCount > 0) {
        return 1;
    }

    return technologies_categoryRepository.delete(id);
};

export default {
    getAllTechnologiesCategoriesPublic,
    getAllTechnologyCategories,
    findTechnologyCategoryById,
    createTechnologyCategory,
    updateTechnologyCategory,
    deleteTechnologyCategory
}