import { Router } from "express";

const resumeRouter = Router();

//Get Resumes
resumeRouter.get('/', (_req, res) => {
    res.json({ message: "List resumes" });
});

//Create Resume
resumeRouter.post('/', (_req, res) => {
    res.status(201).json({ message: "Create resume" });
});

//Get Resume by id
resumeRouter.get('/:id', (_req, res) => {
    res.json({ message: "Get resume" });
});

//Update Resume by id
resumeRouter.patch('/:id', (_req, res) => {
    res.json({ message: "Update resume" });
});

//Delete Resume by id
resumeRouter.delete('/:id', (_req, res) => {
    res.json({ message: "Delete resume" });
});

export default resumeRouter;