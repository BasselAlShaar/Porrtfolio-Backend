import social_linksRepository from "../../repositories/personal_info/social_links.repository.js";
import { saveFile, deleteFile, getFilePath } from "../file_storage.js";
import optimizeImage from "../image_optimizer.js";

import { randomUUID } from "node:crypto";

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

//update icon
const updateIcon = async (
    id: string,
    file: Express.Multer.File
) => {
    const old_icon =
        await social_linksRepository.getIconStorageKey(id);

    if (!old_icon) {
        return null;
    }

    const optimized = await optimizeImage(file.buffer);

    const filename = `${randomUUID()}.webp`;

    const storageKey = await saveFile(
        optimized.buffer,
        `personal_info/social_links`,
        filename
    );

    try {
        const result =
            await social_linksRepository.updateStorageKey(
                storageKey,
                id
            );

        if (!result) {
            await deleteFile(storageKey);
            return null;
        }

        await deleteFile(old_icon);

        return result;
    } catch (error) {
        await deleteFile(storageKey);

        throw error;
    }
};

//delete
const deleteSocialLink = async (id: string) => {

    const result = await social_linksRepository.getById(id);

    if (!result) {
        return null;
    }

    return social_linksRepository.delete(id);
}

const getIcon = async (id: string) => {
    const imageStorageKey = await social_linksRepository.getIconStorageKey(id);

    if (!imageStorageKey) {
        return null;
    }

    return getFilePath(imageStorageKey);
};

export default {
    getIcon,
    getAllSocialLinks,
    getSocialLinkById,
    createSocialLink,
    updateSocialLink,
    updateIcon,
    deleteSocialLink
}