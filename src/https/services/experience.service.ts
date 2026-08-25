import experienceRepository from "../repositories/experience.repository.js";
import type {
    CreateExperienceData,
    UpdateExperienceData,
} from "../../types/experience.js";

const validateExperienceDates = (
    startDate: string,
    endDate: string | null | undefined,
    isCurrent: boolean
): void => {
    const start = new Date(startDate);

    if (Number.isNaN(start.getTime())) {
        throw new Error("Invalid start date.");
    }

    if (endDate !== null && endDate !== undefined) {
        const end = new Date(endDate);

        if (Number.isNaN(end.getTime())) {
            throw new Error("Invalid end date.");
        }
        if (start > end) {
            throw new Error("Start date cannot be after end date.");
        }
    }

    if (isCurrent && endDate !== null && endDate !== undefined) {
        throw new Error("Current experience cannot have an end date.");
    }

    if (!isCurrent && (endDate === null || endDate === undefined)) {
        throw new Error("Experience that is not current must have an end date.");
    }
};

const getAllExperiences = async () => {
    return experienceRepository.findAll();
}

const createExperience = async (
    data: CreateExperienceData
) => {
    validateExperienceDates(
        data.start_date,
        data.end_date,
        data.is_current
    );
    return experienceRepository.create(data);
}

const getExperienceById = async (id: string) => {
    return experienceRepository.findById(id);
}

const updateExperience = async (
    id: string,
    data: UpdateExperienceData
) => {
    const existingExperience = await experienceRepository.findById(id);

    if (!existingExperience) {
        return null;
    }

    const startDate = data.start_date ?? existingExperience.start_date;

    const endDate = data.end_date ?? existingExperience.end_date;

    const isCurrent = data.is_current ?? existingExperience.is_current;

    validateExperienceDates(
        startDate,
        endDate,
        isCurrent
    );

    return experienceRepository.update(id, data);
}

const deleteExperience = async (id: string) => {
    const existingExperience = await experienceRepository.findById(id);

    if (!existingExperience) {
        return null;
    }

    return experienceRepository.delete(id);
}

export default {
    getAllExperiences,
    createExperience,
    getExperienceById,
    updateExperience,
    deleteExperience,
};