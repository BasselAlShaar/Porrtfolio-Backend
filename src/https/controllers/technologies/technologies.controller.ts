import type { Request, Response, NextFunction } from "express"
import technologiesService from "../../services/technologies/technologies.service.js"

//public
//get all
const getAllTechnologiesPublic = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await technologiesService.getAllTechnologiesPublic();

        res.status(200).json(result)
    } catch (error) {
        next(error);
    }
}

// admin
// get all
const getAllTechnologies = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await technologiesService.getAllTechnologies();

        res.status(200).json(result)
    } catch (error) {
        next(error);
    }
}

//get one
const getTechnologyById = async (
    req: Request<{id: string}>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await technologiesService.findTechnologyById(req.params.id);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

//create
const createTechnology = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await technologiesService.createTechnology(req.body);

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

//update
const updateTechnology = async (
    req: Request<{id: string}>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await technologiesService.updateTechnology(req.params.id, req.body);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

//delete
const deleteTechnology = async (
    req: Request<{id: string}>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await technologiesService.deleteTechnology(req.params.id);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export default {
    getAllTechnologiesPublic,
    getAllTechnologies,
    getTechnologyById,
    createTechnology,
    updateTechnology,
    deleteTechnology
}