import type { Request, Response } from "express";

import project_ChallengesService from "../../services/project/project_challenges.service.js";

//get all
const getAllProjectChallenges = async (
    req: Request<{slug: string}>,
    res: Response
) => {
    try {
        const project = await project_ChallengesService.getAllProjectChallenges(req.params.slug);

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
        const project = await project_ChallengesService.getProjectChallengeById(req.params.id);

        res.json(project);
    } catch (error) {
        res.status(500).json({error: (error as Error).message})
    }
}

//create
const createProjectChallenge = async (
    req: Request,
    res: Response
) => {
    try {
        const project = await project_ChallengesService.createProjectChallenge(req.body);

        res.json(project);
    } catch (error) {
        res.status(500).json({error: (error as Error).message})
    }
}

//update
const updateProjectChallenge = async (
    req: Request<{id: string}>,
    res: Response
) => {
    try {
        const project = await project_ChallengesService.updateProjectChallenge(req.params.id,req.body);
        
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
const deleteProjectChallenge = async (
    req: Request<{id: string}>,
    res: Response
) => {
    try {
        const project = await project_ChallengesService.deleteProjectChallenge(req.params.id);
        
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
    getAllProjectChallenges,
    getById,
    createProjectChallenge,
    updateProjectChallenge,
    deleteProjectChallenge
}