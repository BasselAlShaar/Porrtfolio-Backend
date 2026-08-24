import educationRepository from "../repositories/education.repository.js";
import type {
    CreateEducationData,
    UpdateEducationData,
} from "../../types/education.js";

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

        if (end < start) {
            throw new Error(
                "End date cannot be before start date."
            );
        }
    }

    if (isCurrent && endDate !== null && endDate !== undefined) {
        throw new Error(
            "Current education cannot have an end date."
        );
    }

    if (!isCurrent && (endDate === null || endDate === undefined)) {
        throw new Error(
            "Education that is not current must have an end date."
        );
    }
};

const getAllEducations = async () => {
    return educationRepository.findAll();
};

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

const getEducationById = async (id: string) => {
    return educationRepository.findById(id);
};

const updateEducation = async (
    id: string,
    data: UpdateEducationData
) => {
    const existingEducation =
        await educationRepository.findById(id);

    if (!existingEducation) {
        return null;
    }

    const startDate =
        data.start_date ?? existingEducation.start_date;

    const endDate =
        data.end_date !== undefined
            ? data.end_date
            : existingEducation.end_date;

    const isCurrent =
        data.is_current ?? existingEducation.is_current;

    validateEducationDates(
        startDate,
        endDate,
        isCurrent
    );

    return educationRepository.update(id, data);
};

const deleteEducation = async (id: string) => {
    const existingEducation =
        await educationRepository.findById(id);

    if (!existingEducation) {
        return null;
    }

    return educationRepository.delete(id);
};

export default {
    getAllEducations,
    createEducation,
    getEducationById,
    updateEducation,
    deleteEducation,
};