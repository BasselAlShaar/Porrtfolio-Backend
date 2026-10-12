import type { Request, Response } from "express";

import resumeService from "../../services/personal_info/resume.service.js";

// Get public resume
const getPublicResume = async (
    req: Request,
    res: Response
) => {
    try {
        const resume =
            await resumeService.getPublicResume();

        res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({
            error: (error as Error).message,
        });
    }
};

// Get all resumes
const getAllResumes = async (
    req: Request,
    res: Response
) => {
    try {
        const resumes =
            await resumeService.getAllResumes();

        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({
            error: (error as Error).message,
        });
    }
};

// Get one resume
const getResumeById = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const resume =
            await resumeService.getResumeById(
                req.params.id
            );

        if (!resume) {
            res.status(404).json({
                message: "Resume not found",
            });
            return;
        }

        res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({
            error: (error as Error).message,
        });
    }
};

// Get resume file
const getResumeFile = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const filePath =
            await resumeService.getResumeFile(
                req.params.id
            );

        if (!filePath) {
            res.status(404).json({
                message: "Resume file not found",
            });
            return;
        }

        res.sendFile(filePath);
    } catch (error) {
        console.error("getResumeFile error:", error);

        res.status(500).json({
            message: (error as Error).message,
        });
    }
};

// Create resume
const createResume = async (
    req: Request,
    res: Response
) => {
    try {
        const resume =
            await resumeService.createResume(
                req.file!,
                req.body
            );

        res.status(201).json(resume);
    } catch (error) {
        res.status(500).json({
            error: (error as Error).message,
        });
    }
};

// Update resume metadata
const updateResume = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const resume =
            await resumeService.updateResume(
                req.params.id,
                req.body
            );

        if (!resume) {
            res.status(404).json({
                message: "Resume not found",
            });
            return;
        }

        res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({
            error: (error as Error).message,
        });
    }
};

// Delete resume
const deleteResume = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const resume =
            await resumeService.deleteResume(
                req.params.id
            );

        if (!resume) {
            res.status(404).json({
                message: "Resume not found",
            });
            return;
        }

        res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({
            error: (error as Error).message,
        });
    }
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