import { Router } from 'express';

const projectRouter = Router();

//Get All Projects
projectRouter.get('/', (_req, res) => {
    res.json({ message: "List projects" });
});

//Create new Project
projectRouter.post('/', (_req, res) => {
    res.status(201).json({ message: "Create project" });
});

//Get Project by slug
projectRouter.get('/:slug', (_req, res) => {
    res.json({ message: "Get project" });
});

//Update Project by slug
projectRouter.patch('/:slug', (_req, res) => {
    res.json({ message: "Update project" });
});

//Delete Project by slug
projectRouter.delete('/:slug', (_req, res) => {
    res.json({ message: "Delete project" });
});

export default projectRouter;