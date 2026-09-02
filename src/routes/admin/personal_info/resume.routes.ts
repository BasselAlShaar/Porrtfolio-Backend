import { Router } from "express";
import resumeController from "../../../https/controllers/personal_info/resume.controller.js";

const resumeRouter = Router();

//get all resumes
resumeRouter.get('/', resumeController.find_all);

//get one resume by id
resumeRouter.get('/:id', resumeController.getById);

//create a new resume
resumeRouter.post('/', resumeController.create);

//update an existing resume
resumeRouter.patch('/:id', resumeController.update);

//delete a resume
resumeRouter.delete('/:id', resumeController.remove);

export default resumeRouter;