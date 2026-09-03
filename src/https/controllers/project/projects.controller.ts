import type { Request, Response } from "express";

import projectsService from "../../services/project/projects.service.js";

//Public
//get all
const getAllPublicCards = async (
    _req: Request,
    res: Response
) => {
    try {
        const project = await projectsService.getAllProjectsPublic();
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

//get one
const getBySlugPublic = async (
    req: Request<{slug: string}>,
    res: Response
) => {
    try {
        const project = await projectsService.getProjectBySlugPublic(req.params.slug);
        res.json(project);
    } catch (error) {
        res.status(500).json({error: (error as Error).message})
    }
}

//Admin
//get all
const getAllCards = async (
    _req: Request,
    res: Response
) => {
    try {
        const project = await projectsService.getAllProjects();

        res.json(project);
    } catch (error) {
        res.status(500).json({error: (error as Error).message})
    }
}

//get one
const getBySlug = async (
    req: Request<{slug: string}>,
    res: Response
) => {
    try {
        const project = await projectsService.getProjectBySlug(req.params.slug);

        res.json(project);
    } catch (error) {
        res.status(500).json({error: (error as Error).message})
    }
}

//create
const createProject = async (
    req: Request,
    res: Response
) => {
    try {
        const project = await projectsService.createProject(req.body);

        res.json(project);
    } catch (error) {
        res.status(500).json({error: (error as Error).message})
    }
}

//update
const updateProject = async (
    req: Request<{slug: string}>,
    res: Response
) => {
    try {
        const project = await projectsService.updateProject(req.params.slug,req.body);
        
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
const deleteProject = async (
    req: Request<{slug: string}>,
    res: Response
) => {
    try {
        const project = await projectsService.deleteProject(req.params.slug);
        
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
    getAllPublicCards,
    getBySlugPublic,
    getAllCards,
    getBySlug,
    createProject,
    updateProject,
    deleteProject
}