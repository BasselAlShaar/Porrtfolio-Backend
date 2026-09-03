import type { Request, Response } from "express";

import project_linksService from "../../services/project/project_links.service.js";

//get all
const getAllProjectLinks = async (
    req: Request<{slug: string}>,
    res: Response
) => {
    try {
        const project = await project_linksService.getAllProjectLinks(req.params.slug);

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
        const project = await project_linksService.getProjectLinkById(req.params.id);

        res.json(project);
    } catch (error) {
        res.status(500).json({error: (error as Error).message})
    }
}

//create
const createProjectLink = async (
    req: Request,
    res: Response
) => {
    try {
        const project = await project_linksService.createProjectLink(req.body);

        res.json(project);
    } catch (error) {
        res.status(500).json({error: (error as Error).message})
    }
}

//update
const updateProjectLink = async (
    req: Request<{id: string}>,
    res: Response
) => {
    try {
        const project = await project_linksService.updateProjectLink(req.params.id,req.body);
        
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
const deleteProjectLink = async (
    req: Request<{id: string}>,
    res: Response
) => {
    try {
        const project = await project_linksService.deleteProjectLink(req.params.id);
        
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
    getAllProjectLinks,
    getById,
    createProjectLink,
    updateProjectLink,
    deleteProjectLink
}