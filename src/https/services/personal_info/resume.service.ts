import { randomUUID } from "node:crypto";

import { deleteFile, saveFile, getFilePath } from "../file_storage.js";

import resumeRepository from "../../repositories/personal_info/resume.repository.js";

import type {
    CreateResumeData,
    UpdateResumeData,
} from "../../../types/personal_info/resume.js";

// Get public resume
const getPublicResume = async () => {
    const resume = await resumeRepository.getPublicResume();

    if (!resume) {
        return null;
    }

    return {
        ...resume,
        file_url: `/api/v1/personal_info/resumes/${resume.id}/file`,
    };
};

// Get all resumes
const getAllResumes = async () => {
    const resumes = await resumeRepository.find_all();

    return resumes.map((resume) => ({
        ...resume,
        file_url: `/api/v1/personal_info/resumes/${resume.id}/file`,
    }));
};

// Get one resume
const getResumeById = async (id: string) => {
    const resume = await resumeRepository.getById(id);

    if (!resume) {
        return null;
    }

    return {
        ...resume,
        file_url: `/api/v1/personal_info/resumes/${resume.id}/file`,
    };
};

// Get resume file
const getResumeFile = async (id: string) => {
    const resume = await resumeRepository.getById(id);

    if (!resume) {
        return null;
    }

    return getFilePath(
        resume.file_url
    );
};

// Create resume
const createResume = async (
    file: Express.Multer.File,
    data: CreateResumeData
) => {
    const resumes = await resumeRepository.find_all();

    // The first resume must always be active.
    if (resumes.length === 0) {
        data.is_active = true;
    }

    // Deactivate the current resume if the new resume should be active.
    if (data.is_active === true && resumes.length > 0) {
        await resumeRepository.deactivateAll();
    }

    const filename = `${randomUUID()}.pdf`;

    const id = randomUUID();

    const storageKey = await saveFile(
        file.buffer,
        `personal_info/resumes`,
        filename
    );
    
    try {
        data.file_storage_key = storageKey;
        
        return await resumeRepository.create(id,data);
    } catch (error) {
        await deleteFile(storageKey);

        throw error;
    }
};

// Update resume metadata
const updateResume = async (
    id: string,
    data: UpdateResumeData
) => {
    const existingResume = await resumeRepository.getById(id);

    if (!existingResume) {
        return null;
    }

    // Prevent the only active resume from becoming inactive.
    if (
        existingResume.is_active === true &&
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

    // Activate this resume and deactivate the others.
    if (data.is_active === true) {
        await resumeRepository.deactivateAll();
    }

    return resumeRepository.update(id, data);
};

// Delete resume
const deleteResume = async (id: string) => {
    const existingResume = await resumeRepository.getById(id);

    if (!existingResume) {
        return null;
    }

    // Prevent deleting the only resume.
    const resumeCount = await resumeRepository.count();

    if (existingResume.is_active && resumeCount === 1) {
        throw new Error(
            "Cannot delete the only resume."
        );
    }

    // Find a replacement if deleting the active resume.
    let nextResume = null;

    if (existingResume.is_active) {
        nextResume = await resumeRepository.getPreviousResume(id);

        if (!nextResume) {
            throw new Error(
                "Cannot delete the active resume because no replacement resume was found."
            );
        }
    }

    const result = await resumeRepository.remove(id);

    if (!result) {
        return null;
    }

    // Activate the replacement before deleting the file.
    if (nextResume) {
        await resumeRepository.activate(nextResume.id);
    }

    await deleteFile(existingResume.file_url);

    return nextResume ?? result;
};

export default {
    getPublicResume,
    getAllResumes,
    getResumeById,
    getResumeFile,
    createResume,
    updateResume,
    deleteResume,
};