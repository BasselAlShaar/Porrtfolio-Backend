import { Router } from "express";
import resumeController from "../../../https/controllers/personal_info/resume.controller.js";
import { validateResumeFile } from "../../../https/middlewares/pdfValidator.js";
import { validateCreate, validateUpdate } from "../../../https/middlewares/personal_info/resume.middleware.js";
import upload from "../../../https/middlewares/upload.js";

const resumeRouter = Router();

//get all resumes
resumeRouter.get('/', resumeController.getAllResumes);

//get resume file by id
resumeRouter.get('/:id/file', resumeController.getResumeFile);

//get one resume by id
resumeRouter.get('/:id', resumeController.getResumeById);

//create a new resume
resumeRouter.post('/', upload.single("file"), validateCreate, validateResumeFile, resumeController.createResume);

//update an existing resume
resumeRouter.patch('/:id', validateUpdate, resumeController.updateResume);

//delete a resume
resumeRouter.delete('/:id', resumeController.deleteResume);

export default resumeRouter;