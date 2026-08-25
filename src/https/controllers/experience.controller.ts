import type { Request, Response, NextFunction } from 'express';

import experienceService from '../services/experience.service.js';

// Get All
const getAllExperiences = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const experiences = await experienceService.getAllExperiences();
        res.status(200).json(experiences);
    } catch (error) {
        next(error);
    }
};

// Create
const createExperience = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const experience = await experienceService.createExperience(req.body);
        res.status(201).json(experience);
    } catch (error) {
        next(error);
    }
};

// Get by ID
const getExperienceById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const experience = await experienceService.getExperienceById(req.params.id);
        if (!experience) {
            res.status(404).json({ error: "Experience not found." });
            return;
        }
        res.status(200).json(experience);
    } catch (error) {
        next(error);
    }
};

// Update
const updateExperience = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const experience = await experienceService.updateExperience(req.params.id, req.body);
        if (!experience) {
            res.status(404).json({ error: "Experience not found." });
            return;
        }
        res.status(200).json(experience);
    } catch (error) {
        next(error);
    }
};

// Delete
const deleteExperience = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const experience = await experienceService.deleteExperience(req.params.id);
        if (!experience) {
            res.status(404).json({ error: "Experience not found." });
            return;
        }
        res.status(204).json(experience);
    } catch (error) {
        next(error);
    }
};

export default {
    getAllExperiences,
    createExperience,
    getExperienceById,
    updateExperience,
    deleteExperience
};
