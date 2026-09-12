import personal_infoRepository from "../../repositories/personal_info/personal_info.repository.js";

import { saveFile, deleteFile, getFilePath } from "../file_storage.js";
import optimizeImage from "../image_optimizer.js";

import { randomUUID } from "node:crypto";

import type { 
    PersonalInfoData,
    UpdatePersonalInfoData
} from "../../../types/personal_info/personal_info.js";
import type { SocialLinksData } from "../../../types/personal_info/social_links.js";

const getPersonalInfoBase = (personal_info: PersonalInfoData) => ({
    full_name: personal_info.full_name,
    professional_title: personal_info.professional_title,
    short_bio: personal_info.short_bio,
    bio: personal_info.bio,
    location: personal_info.location,
    email: personal_info.email,
    phone: personal_info.phone,
    availability_status: personal_info.availability_status,
    availability_text: personal_info.availability_text,
    image_url: `/api/v1/personal_info/file`,
});

//get public
const getPersonalInfoPublic = async () => {
    const personal_info = await personal_infoRepository.getPublic();

    return {
        ...getPersonalInfoBase(personal_info),
        
        links: personal_info.links.map((link: SocialLinksData) => ({
            id: link.id,
            platform: link.platform,
            label: link.label,
            url: link.url,
            icon: `/api/v1/personal_info/links/${link.id}/file`
        }))
    }
}

//get admin
const getPersonalInfo = async () => {
    const personal_info = await personal_infoRepository.get();

    return {
        ...getPersonalInfoBase(personal_info),

        links: personal_info.links.map((link: SocialLinksData) => ({
            id: link.id,
            platform: link.platform,
            label: link.label,
            url: link.url,
            display_order: link.display_order,
            is_visible: link.is_visible,
            icon: `/api/v1/admin/personal_info/links/${link.id}/file`
        }))
    }
}

//get image file
const getImageFile = async () => {
    const imageStorageKey = await personal_infoRepository.getImageStorageKey();

    if (!imageStorageKey) {
        return null;
    }

    return getFilePath(imageStorageKey);
};

//update
const updatePersonalInfo = async (
    data: UpdatePersonalInfoData
) => {
    return personal_infoRepository.update(data);
}

//update image
const updatePersonalInfoProfileImage = async (
    file: Express.Multer.File
) => {

    const oldImage = await personal_infoRepository.getImageStorageKey();

    const optimized = await optimizeImage(file.buffer);

    const filename = `${randomUUID()}.webp`;

    const storageKey = await saveFile(
        optimized.buffer,
        `personal_info`,
        filename
    );

    try {
        const result =
            await personal_infoRepository.updateStorageKey(
                storageKey
            );

        if (!result) {
            await deleteFile(storageKey);
            return null;
        }

        if(oldImage) {
            await deleteFile(oldImage);
        }

        return result;
    } catch (error) {
        await deleteFile(storageKey);

        throw error;
    }
}

export default {
    getPersonalInfoPublic,
    getPersonalInfo,
    getImageFile,
    updatePersonalInfo,
    updatePersonalInfoProfileImage
}