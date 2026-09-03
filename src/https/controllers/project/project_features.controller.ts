import type { Request, Response } from "express";

import project_featuresService from "../../services/project/project_features.service.js";

//get all
const getAllProjectFeatures = async (
    req: Request<{slug: string}>,
    res: Response
) => {
    try {
        const project = await project_featuresService.getAllProjectFeatures(req.params.slug);

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
        const project = await project_featuresService.getProjectFeatureById(req.params.id);

        res.json(project);
    } catch (error) {
        res.status(500).json({error: (error as Error).message})
    }
}

//create
const createProjectFeature = async (
    req: Request,
    res: Response
) => {
    try {
        const project = await project_featuresService.createProjectFeature(req.body);

        res.json(project);
    } catch (error) {
        res.status(500).json({error: (error as Error).message})
    }
}

//update
const updateProjectFeature = async (
    req: Request<{id: string}>,
    res: Response
) => {
    try {
        const project = await project_featuresService.updateProjectFeature(req.params.id,req.body);
        
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
const deleteProjectFeature = async (
    req: Request<{id: string}>,
    res: Response
) => {
    try {
        const project = await project_featuresService.deleteProjectFeature(req.params.id);
        
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
    getAllProjectFeatures,
    getById,
    createProjectFeature,
    updateProjectFeature,
    deleteProjectFeature
}