import type { Request, Response, NextFunction } from "express"
import skillsService from "../../services/skills/skills.service.js"

//public
//get all
const getAllSkillsPublic = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await skillsService.getAllSkillsPublic();

        res.status(200).json(result)
    } catch (error) {
        next(error);
    }
}

// admin
// get all
const getAllSkills = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await skillsService.getAllSkills();

        res.status(200).json(result)
    } catch (error) {
        next(error);
    }
}

//get one
const getSkillById = async (
    req: Request<{id: string}>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await skillsService.findSkillById(req.params.id);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

//create
const createSkill = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await skillsService.createSkill(req.body);

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

//update
const updateSkill = async (
    req: Request<{id: string}>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await skillsService.updateSkill(req.params.id, req.body);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

//delete
const deleteSkill = async (
    req: Request<{id: string}>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await skillsService.deleteSkill(req.params.id);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export default {
    getAllSkillsPublic,
    getAllSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill
}