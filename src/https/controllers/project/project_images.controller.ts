import type { Request, Response } from "express";

import project_imagesService from "../../services/project/project_images.service.js";

//get all
const getAllProjectImages = async (
    req: Request<{slug: string}>,
    res: Response
) => {
    try {
        const project = await project_imagesService.getAllProjectImages(req.params.slug);

        res.json(project);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

//get one
const getById = async (
    req: Request<{id: string}>,
    res: Response
) => {
    try {
        const project = await project_imagesService.getProjectImageById(req.params.id);

        res.json(project);
    } catch (error) {
        res.status(500).json({error: (error as Error).message})
    }
}

//create
const createProjectImage = async (
    req: Request,
    res: Response
) => {
    try {
        const project = await project_imagesService.createProjectImage(req.body);

        res.json(project);
    } catch (error) {
        res.status(500).json({error: (error as Error).message})
    }
}

//update
const updateProjectImage = async (
    req: Request<{id: string}>,
    res: Response
) => {
    try {
        const project = await project_imagesService.updateProjectImage(req.params.id,req.body);
        
        if(!project) {
            res.status(404).json({
                message: "project not found"
            })
            return;
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({error: (error as Error).message})
    }
}

//delete
const deleteProjectImage = async (
    req: Request<{id: string}>,
    res: Response
) => {
    try {
        const project = await project_imagesService.deleteProjectImage(req.params.id);
        
        if(!project) {
            res.status(404).json({
                message: "project not found"
            })
            return;
        }


        res.json(project);
    } catch (error) {
        res.status(500).json({error: (error as Error).message})
    }
}

export default {
    getAllProjectImages,
    getById,
    createProjectImage,
    updateProjectImage,
    deleteProjectImage
}