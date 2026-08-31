import type { Request, Response, NextFunction } from "express";
import experience_achievementsService from "../../services/experience/experience_achievements.service.js";

//get all
const getAllExperienceAchievements = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await experience_achievementsService.getAllExperienceAchievements(req.params.id);

        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}

//get one
const getExperienceAchievementById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await experience_achievementsService.getExperienceAchievementById(req.params.id);

        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}

//create
const createExperienceAchievement = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await experience_achievementsService.createExperienceAchievement(req.body);

        res.status(201).json(result);
    } catch (error) {
        next(error)
    }
}

//update
const updateExperienceAchievement = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await experience_achievementsService.updateExperienceAchievement(req.params.id, req.body);

        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}

//delete
const deleteExperienceAchievement = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await experience_achievementsService.deleteExperienceAchievement(req.params.id);

        res.status(204).json(result);
    } catch (error) {
        next(error)
    }
}

export default {
    getAllExperienceAchievements,
    getExperienceAchievementById,
    createExperienceAchievement,
    updateExperienceAchievement,
    deleteExperienceAchievement
}