import type { Request, Response, NextFunction } from "express";
import education_achievementsService from "../../services/education/education_achievements.service.js";

//get all
const getAllEducationAchievements = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await education_achievementsService.getAllEducationAchievements(req.params.id);

        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}

//get one
const getEducationAchievementById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await education_achievementsService.getEducationAchievementById(req.params.id);

        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}

//create
const createEducationAchievement = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await education_achievementsService.createEducationAchievement(req.params.id, req.body);

        res.status(201).json(result);
    } catch (error) {
        next(error)
    }
}

//update
const updateEducationAchievement = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await education_achievementsService.updateEducationAchievement(req.params.id, req.body);

        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}

//delete
const deleteEducationAchievement = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await education_achievementsService.deleteEducationAchievement(req.params.id);

        res.status(204).json(result);
    } catch (error) {
        next(error)
    }
}