import { Router } from "express";
import resumeController from "../../../https/controllers/personal_info/resume.controller.js";
import { validateResumeFile } from "../../../https/middlewares/pdfValidator.js";
import { validateCreate, validateUpdate } from "../../../https/middlewares/personal_info/resume.middleware.js";
import upload from "../../../https/middlewares/upload.js";
import validateUUID from "../../../https/middlewares/validateUUID.js";

const resumeRouter = Router();

//get all resumes
resumeRouter.get('/', resumeController.getAllResumes);

//get one resume by id
resumeRouter.get('/:id', validateUUID, resumeController.getResumeById);

//create a new resume
resumeRouter.post('/', upload.single("file"), validateResumeFile, validateCreate, resumeController.createResume);

//update an existing resume
resumeRouter.patch('/:id', validateUUID, validateUpdate, resumeController.updateResume);

//delete a resume
resumeRouter.delete('/:id', validateUUID, resumeController.deleteResume);

export default resumeRouter;