import social_linksRepository from "../../repositories/personal_info/social_links.repository.js";

import type { 
    CreateSocialLinksData,
    UpdateSocialLinksData
} from "../../../types/personal_info/social_links.js";

//get all
const getAllSocialLinks = async () => {
    return social_linksRepository.find_all();
}

//get one
const getSocialLinkById = async (id: string) => {
    return social_linksRepository.getById(id);
}

//create
const createSocialLink = async (
    data: CreateSocialLinksData
) => {
    return social_linksRepository.create(data);
}

//update
const updateSocialLink = async (
    id: string,
    data: UpdateSocialLinksData
) => {
    const result = await social_linksRepository.getById(id);

    if (!result) {
        return null;
    }

    return social_linksRepository.update(id, data);
}

//delete
const deleteSocialLink = async (id: string) => {

    const result = await social_linksRepository.getById(id);

    if (!result) {
        return null;
    }

    return social_linksRepository.delete(id);
}

export default {
    getAllSocialLinks,
    getSocialLinkById,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink
}