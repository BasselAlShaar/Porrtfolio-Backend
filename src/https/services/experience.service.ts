// ================================================================
//    EXPERIENCE SERVICE
// ================================================================
//
// Business logic for experience records.
//
// This layer sits between the controllers and repository:
//
//     Controller → Service → Repository
//
// The repository handles database operations.
// The service makes sure the data actually makes sense.
//
// Because apparently, databases don't stop you from saying:
//
//     "I am currently working here"
//     "I left in 2022"
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
//
// Validates the date-related business rules for an experience.
//
// Rules:
//     1. start_date must be a valid date.
//     2. end_date must be a valid date when provided.
//     3. start_date cannot be after end_date.
//     4. Current experiences cannot have an end date.
//     5. Non-current experiences must have an end date.
//
// Keeping these rules here prevents the controller from becoming
// a giant pile of if-statements nobody wants to maintain.
//
// ================================================================
const validateExperienceDates = (
    startDate: string,
    endDate: string | null | undefined,
    isCurrent: boolean
): void => {
    const start = new Date(startDate);

    // Make sure JavaScript didn't just quietly create an invalid date.
    if (Number.isNaN(start.getTime())) {
        throw new Error("Invalid start date.");
    }

    // endDate is optional depending on whether the experience is current.
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

    // A current position should not have an end date.
    if (isCurrent && endDate !== null && endDate !== undefined) {
        throw new Error("Current experience cannot have an end date.");
    }

    // If the experience has ended, we need to know when it ended.
    if (!isCurrent && (endDate === null || endDate === undefined)) {
        throw new Error("Experience that is not current must have an end date.");
    }
};

// ================================================================
//    GET ALL
// ================================================================
//
// Retrieves all experience records.
//
// No business rules are required here because the repository is
// responsible for fetching the records.
//
// Keeping this method thin is intentional.
//
// Thin service method > unnecessary abstraction gymnastics.
//
// ================================================================
const getAllExperiences = async () => {
    return experienceRepository.findAll();
}

// ================================================================
//    CREATE
// ================================================================
//
// Creates a new experience record.
//
// Before touching the database, validate the date relationships.
// This ensures invalid business data never reaches the repository.
//
// Flow:
//
//     Request → Controller → Service → Validate → Repository
//
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
//
// Retrieves one experience record by its ID.
//
// The service does not need additional business logic here.
// UUID validation should already be handled by the middleware.
//
// ================================================================
const getExperienceById = async (id: string) => {
    return experienceRepository.findById(id);
}

// ================================================================
//    UPDATE
// ================================================================
//
// Partially updates an existing experience.
//
// Because PATCH requests may only contain some fields, we first
// retrieve the existing record and combine it with the incoming data.
//
// This catches invalid combinations before updating the database.
//
// ================================================================
const updateExperience = async (
    id: string,
    data: UpdateExperienceData
) => {
    const existingExperience = await experienceRepository.findById(id);

    // Let the controller decide how to respond to a missing record.
    if (!existingExperience) {
        return null;
    }

    // Keep existing values for fields not included in the PATCH.
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

    // Validate the final state, not just the fields being changed.
    validateExperienceDates(
        startDate,
        endDate,
        isCurrent
    );

    return experienceRepository.update(id, data);
}

// ================================================================
//    DELETE
// ================================================================
//
// Deletes an experience record by ID.
//
// We first verify that the record exists so the service can return
// null consistently when there is nothing to delete.
//
// Then the repository handles the actual database operation.
//
// ================================================================
const deleteExperience = async (id: string) => {
    const existingExperience = await experienceRepository.findById(id);

    if (!existingExperience) {
        return null;
    }

    // And just like that, this experience becomes... experience.
    return experienceRepository.delete(id);
}

// ================================================================
//    EXPORT
// ================================================================
//
// Export the service methods used by the experience controller.
//
// Controllers should talk to this service instead of reaching
// directly into the repository.
//
// Separation of concerns: because future-us deserves nice things.
//
// ================================================================
export default {
    getAllExperiences,
    createExperience,
    getExperienceById,
    updateExperience,
    deleteExperience,
};