import { Router } from "express";
//import { educationMiddlewareAdmin } from "../../middlewares/admin/education.middleware.js";

const educationRouter = Router();

//Middleware
//educationRouter.use(educationMiddlewareAdmin);

//Get All Educations
educationRouter.get('/', (_req, res) => {
    res.json({ message: "List educations" });
});

//Create new Education
educationRouter.post('/', (_req, res) => {
    res.status(201).json({ message: "Create education" });
});

//Get Education by id
educationRouter.get('/:id', (_req, res) => {
    res.json({ message: "Get education" });
});

//Update Education by id
educationRouter.patch('/:id', (_req, res) => {
    res.json({ message: "Update education" });
});

//Delete Education by id
educationRouter.delete('/:id', (_req, res) => {
    res.json({ message: "Delete education" });
});

export default educationRouter;