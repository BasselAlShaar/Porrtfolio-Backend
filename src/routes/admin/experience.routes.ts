import { Router } from "express";

const experienceRouter = Router();

//Get All Experiences
experienceRouter.get('/', (_req, res) => {
    res.json({ message: "List experiences" });
});

//Create new Experience
experienceRouter.post('/', (_req, res) => {
    res.status(201).json({ message: "Create experience" });
});

//Get Experience by id
experienceRouter.get('/:id', (_req, res) => {
    res.json({ message: "Get experience" });
});

//Update Experience by id
experienceRouter.patch('/:id', (_req, res) => {
    res.json({ message: "Update experience" });
});

//Delete Experience by id
experienceRouter.delete('/:id', (_req, res) => {
    res.json({ message: "Delete experience" });
});

export default experienceRouter;