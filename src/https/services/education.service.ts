// ================================================================
//    EXPERIENCE SERVICE
// ================================================================
//
// Business logic for experience records.
//
// Controller → Service → Repository
//
// Middleware handles request validation.
// Service handles business rules.
// Repository handles persistence.
//
// ================================================================

import experienceRepository from "../repositories/experience.repository.js";

import type {
    CreateExperienceData,
    UpdateExperienceData,
} from "../../types/experience.js";

// ================================================================
//    DATE VALIDATION
// ================================================================

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
            throw new Error(
                "Start date cannot be after end date."
            );
        }
    }

    if (isCurrent && endDate !== null && endDate !== undefined) {
        throw new Error(
            "Current experience cannot have an end date."
        );
    }

    if (!isCurrent && (endDate === null || endDate === undefined)) {
        throw new Error(
            "Experience that is not current must have an end date."
        );
    }
};

// ================================================================
//    GET ALL
// ================================================================

const getAllExperiences = async () => {
    return experienceRepository.findAll();
};

// ================================================================
//    CREATE
// ================================================================

const createExperience = async (
    data: CreateExperienceData
) => {
    validateExperienceDates(
        data.start_date,
        data.end_date,
        data.is_current
    );

    return experienceRepository.create(data);
};

// ================================================================
//    GET BY ID
// ================================================================

const getExperienceById = async (id: string) => {
    return experienceRepository.findById(id);
};

// ================================================================
//    UPDATE
// ================================================================

const updateExperience = async (
    id: string,
    data: UpdateExperienceData
) => {
    const existingExperience =
        await experienceRepository.findById(id);

    if (!existingExperience) {
        return null;
    }

    /*
     * Important:
     *
     * Do not use `??` here.
     *
     * null is a meaningful value for end_date.
     * We need to distinguish:
     *
     * undefined → field was not supplied
     * null      → field was explicitly cleared
     */

    const startDate =
        data.start_date !== undefined
            ? data.start_date
            : existingExperience.start_date;

    const endDate =
        data.end_date !== undefined
            ? data.end_date
            : existingExperience.end_date;

    const isCurrent =
        data.is_current !== undefined
            ? data.is_current
            : existingExperience.is_current;

    validateExperienceDates(
        startDate,
        endDate,
        isCurrent
    );

    return experienceRepository.update(id, data);
};

// ================================================================
//    DELETE
// ================================================================

const deleteExperience = async (id: string) => {
    return experienceRepository.remove(id);
};

// ================================================================
//    EXPORT
// ================================================================

export default {
    getAllExperiences,
    createExperience,
    getExperienceById,
    updateExperience,
    deleteExperience,
};