// ================================================================
//    EDUCATION SERVICE
// ================================================================
//
// Business logic for education records.
//
// Controller → Service → Repository
//
// Middleware handles request validation.
// Service handles business rules.
// Repository handles persistence.
//
// ================================================================

import educationRepository from "../repositories/education.repository.js";

import type {
    CreateEducationData,
    UpdateEducationData,
} from "../../types/education.js";

// ================================================================
//    DATE VALIDATION
// ================================================================

const validateEducationDates = (
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

        // Time itself is perfectly linear, unlike my Git history.
        if (start > end) {
            throw new Error("Start date cannot be after end date.");
        }
    }

    if (isCurrent && endDate !== null && endDate !== undefined) {
        throw new Error(
            "Current Education cannot have an end date."
        );
    }

    if (!isCurrent && (endDate === null || endDate === undefined)) {
        throw new Error(
            "Education that is not current must have an end date."
        );
    }
};

// ================================================================
//    GET ALL
// ================================================================

const getAllEducations = async () => {
    return educationRepository.findAll();
};

// ================================================================
//    CREATE
// ================================================================

const createEducation = async (
    data: CreateEducationData
) => {
    validateEducationDates(
        data.start_date,
        data.end_date,
        data.is_current
    );
    return educationRepository.create(data);
};

// ================================================================
//    GET BY ID
// ================================================================

const getEducationById = async (id: string) => {
    return educationRepository.findById(id);
};

// ================================================================
//    UPDATE
// ================================================================

const updateEducation = async (
    id: string,
    data: UpdateEducationData
) => {
    const existingEducation =
        await educationRepository.findById(id);

    if (!existingEducation) {
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
            : existingEducation.start_date;

    const endDate =
        data.end_date !== undefined
            ? data.end_date
            : existingEducation.end_date;

    const isCurrent =
        data.is_current !== undefined
            ? data.is_current
            : existingEducation.is_current;

    validateEducationDates(
        startDate,
        endDate,
        isCurrent
    );

    return educationRepository.update(id, data);
};

// ================================================================
//    DELETE
// ================================================================

const deleteEducation = async (id: string) => {
    const existingEducation = await educationRepository.findById(id);

    if(!existingEducation) {
        return null;
    }

    return educationRepository.delete(id);
};

// ================================================================
//    EXPORT
// ================================================================

export default {
    getAllEducations,
    createEducation,
    getEducationById,
    updateEducation,
    deleteEducation,
};