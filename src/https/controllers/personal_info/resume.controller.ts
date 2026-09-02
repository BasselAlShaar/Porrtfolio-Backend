import resumeService from "../../services/personal_info/resume.service.js";

import type { Request, Response } from "express";

// Get public resume
const getPublicResume = async (req: Request, res: Response) => {
    try {
        const resume = await resumeService.getPublicResume();
        res.json(resume);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Admin
// Get all resumes
const find_all = async (req: Request, res: Response) => {
    try {
        const resumes = await resumeService.find_all();
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Get a specific resume by ID
const getById = async (
    req: Request<{ id: string }>,
    res: Response
) => {

    try {

        const resume = await resumeService.getById(req.params.id);

        if (!resume) {
            return res.status(404).json({ error: "Resume not found." });
        }

        res.json(resume);

    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Create a new resume
const create = async (
    req: Request,
    res: Response
) => {
    try {
        const newResume = await resumeService.create(req.body);
        res.status(201).json(newResume);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

// Update an existing resume
const update = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const updatedResume = await resumeService.update(
            req.params.id,
            req.body
        );
        res.json(updatedResume);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

//delete a resume
const remove = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const deletedResume = await resumeService.remove(req.params.id);
        res.json(deletedResume);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export default {
    getPublicResume,
    find_all,
    getById,
    create,
    update,
    remove
};