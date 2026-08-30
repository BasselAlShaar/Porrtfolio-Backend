import type { Request, Response, NextFunction } from "express";

import skills_categoryService from "../../services/skills/skills_category.service.js";

//public
//get all
const getAllSkillCategoriesPublic = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await skills_categoryService.getAllSkillsCategoriesPublic();

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

//admin
//get all
const getAllSkillCategories = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await skills_categoryService.getAllSkillCategories();

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

//get by id
const getSkillCategoryById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await skills_categoryService.findSkillCategoryById(req.params.id);

        if (!result) {
            res.status(404).json({
                "message": "skill category not found",
            });

            return
        }

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}

//create
const createSkillCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await skills_categoryService.createSkillCategory(req.body)

        res.status(201).json(result);

    } catch (error) {
        next(error);
    }
}

//update
const updateSkillCategory = async (
    req: Request<{id:   string}>,
    res: Response,
    next: NextFunction
) => {
    try {

        const result = await skills_categoryService.updateSkillCategory(req.params.id, req.body);

        if (!result) {
            res.status(404).json({
                message: "skill category not found",
            });

            return;
        }

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}

//delete
const deleteSkillCategory = async (
    req: Request<{id:string}>,
    res: Response,
    next: NextFunction
) => {
    try {

        const result = await skills_categoryService.deleteSkillCategory(req.params.id);

        if (!result) {
            res.status(404).json({
                "message":  "skill category not found",
            });

            return
        }

        if (result === 1) {
            res.status(400).json({
                "message":  "skill category must be empty",
            });

            return
        }

        res.status(204).send();

    } catch (error) {
        next(error);
    }
}

export default {
    getAllSkillCategoriesPublic,
    getAllSkillCategories,
    getSkillCategoryById,
    createSkillCategory,
    updateSkillCategory,
    deleteSkillCategory
}