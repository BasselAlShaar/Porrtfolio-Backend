import resumeRepository from "../../repositories/personal_info/resume.repository.js";

import type {
    CreateResumeData,
    UpdateResumeData
} from "../../../types/personal_info/resume.js";
import pool from "../../../config/database.js";

// Get public resume
const getPublicResume = async () => {
    return await resumeRepository.getPublicResume();
};

// Admin
// Get all
const find_all = async () => {
    return await resumeRepository.find_all();
};

// Get one
const getById = async (id: string) => {
    return await resumeRepository.getById(id);
};

// Create
const create = async (data: CreateResumeData) => {

    const resumes = await resumeRepository.find_all();

    // First resume must always be active
    if (resumes.length === 0) {
        data.is_active = true;
    }


    // If the new resume should be active,
    // deactivate the current active resume first.
    if (data.is_active === true) {
        await resumeRepository.deactivateAll();
    }

    return await resumeRepository.create(data);
};

// Update
const update = async (
    id: string,
    data: UpdateResumeData
) => {

    const currentResume = await resumeRepository.getById(id);

    if (!currentResume) {
        throw new Error(
            "Resume not found."
        );
    }

    // Prevent the only active resume from becoming inactive
    if (
        currentResume.is_active === true &&
        data.is_active === false
    ) {
        const resumeCount = await resumeRepository.count();

        if (resumeCount === 1) {
            throw new Error(
                "Cannot deactivate the only resume."
            );
        }

        throw new Error(
            "Cannot deactivate the active resume. Activate another resume first."
        );
    }

    // Activating this resume
    if (data.is_active === true) {
        await resumeRepository.deactivateAll();
    }

    return await resumeRepository.update(id, data);
};

// Delete
const remove = async (id: string) => {

    const currentResume = await resumeRepository.getById(id);

    if (!currentResume) {
        return null;
    }

    // If deleting an inactive resume, simply delete it.
    if (!currentResume.is_active) {
        return await resumeRepository.remove(id);
    }

    // The active resume cannot be deleted if it is
    // the only resume available.
    const resumeCount = await resumeRepository.count();

    if (resumeCount === 1) {
        throw new Error(
            "Cannot delete the only resume."
        );
    }

    // Find the next resume that should become active.
    const nextResume = await resumeRepository.getPreviousResume(id);

    if (!nextResume) {
        throw new Error(
            "Cannot delete the active resume because no replacement resume was found."
        );
    }

    // Delete current active resume
    await resumeRepository.remove(id);

    // Promote previous resume
    await resumeRepository.activate(nextResume.id);

    return nextResume;
};

export default {
    getPublicResume,
    find_all,
    getById,
    create,
    update,
    remove
};