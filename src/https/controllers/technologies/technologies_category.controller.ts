import type { Request, Response, NextFunction } from "express";

import technologies_categoryService from "../../services/technologies/technologies_category.service.js";

//public
//get all
const getAllTechnologyCategoriesPublic = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await technologies_categoryService.getAllTechnologiesCategoriesPublic();

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

//admin
//get all
const getAllTechnologyCategories = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await technologies_categoryService.getAllTechnologyCategories();

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

//get by id
const getTechnologyCategoryById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await technologies_categoryService.findTechnologyCategoryById(req.params.id);

        if (!result) {
            res.status(404).json({
                "message": "Technology category not found",
            });

            return
        }

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}

//create
const createTechnologyCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await technologies_categoryService.createTechnologyCategory(req.body)

        res.status(201).json(result);

    } catch (error) {
        next(error);
    }
}

//update
const updateTechnologyCategory = async (
    req: Request<{id:   string}>,
    res: Response,
    next: NextFunction
) => {
    try {

        const result = await technologies_categoryService.updateTechnologyCategory(req.params.id, req.body);

        if (!result) {
            res.status(404).json({
                message: "Technology category not found",
            });

            return;
        }

        res.status(200).json(result);

    } catch (error) {
        next(error);
    }
}

//delete
const deleteTechnologyCategory = async (
    req: Request<{id:string}>,
    res: Response,
    next: NextFunction
) => {
    try {

        const result = await technologies_categoryService.deleteTechnologyCategory(req.params.id);

        if (!result) {
            res.status(404).json({
                "message":  "Technology category not found",
            });

            return
        }

        if (result === 1) {
            res.status(400).json({
                "message":  "Technology category must be empty",
            });

            return
        }

        res.status(204).send();

    } catch (error) {
        next(error);
    }
}

export default {
    getAllTechnologyCategoriesPublic,
    getAllTechnologyCategories,
    getTechnologyCategoryById,
    createTechnologyCategory,
    updateTechnologyCategory,
    deleteTechnologyCategory
}