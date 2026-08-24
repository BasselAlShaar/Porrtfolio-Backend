import type { Request, Response, NextFunction } from "express";

import educationService from "../services/education.service.js";

// Get All
const getAllEducations = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const educations = await educationService.getAllEducations();

        res.status(200).json(educations);
    } catch (error) {
        next(error);
    }
};

// Create
const createEducation = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const education = await educationService.createEducation(req.body);

        res.status(201).json(education);
    } catch (error) {
        next(error);
    }
};

// Get by ID
const getEducationById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const education = await educationService.getEducationById(
            req.params.id
        );

        if (!education) {
            res.status(404).json({
                message: "Education not found",
            });

            return;
        }

        res.status(200).json(education);
    } catch (error) {
        next(error);
    }
};

// Update
const updateEducation = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const education = await educationService.updateEducation(
            req.params.id,
            req.body
        );

        if (!education) {
            res.status(404).json({
                message: "Education not found",
            });

            return;
        }

        res.status(200).json(education);
    } catch (error) {
        next(error);
    }
};

// Delete
const deleteEducation = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const education = await educationService.deleteEducation(
            req.params.id
        );

        if (!education) {
            res.status(404).json({
                message: "Education not found",
            });

            return;
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export default {
    getAllEducations,
    createEducation,
    getEducationById,
    updateEducation,
    deleteEducation,
};