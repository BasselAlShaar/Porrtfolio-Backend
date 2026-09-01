import type { Request, Response, NextFunction } from "express";
import experience_responsibilitiesService from "../../services/experience/experience_responsibilities.service.js";

//get all
const getAllExperienceResponsibilities = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await experience_responsibilitiesService.getAllExperienceResponsibilities(req.params.id);

        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}

//get one
const getExperienceResponsibilityById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await experience_responsibilitiesService.getExperienceResponsibilityById(req.params.id);

        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}

//create
const createExperienceResponsibility = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await experience_responsibilitiesService.createExperienceResponsibility(req.body);

        res.status(201).json(result);
    } catch (error) {
        next(error)
    }
}

//update
const updateExperienceResponsibility = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await experience_responsibilitiesService.updateExperienceResponsibility(req.params.id, req.body);

        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}

//delete
const deleteExperienceResponsibility = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await experience_responsibilitiesService.deleteExperienceResponsibility(req.params.id);

        res.status(204).json(result);
    } catch (error) {
        next(error)
    }
}

export default {
    getAllExperienceResponsibilities,
    getExperienceResponsibilityById,
    createExperienceResponsibility,
    updateExperienceResponsibility,
    deleteExperienceResponsibility
}