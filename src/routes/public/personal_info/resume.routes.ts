import { Router } from "express";
import resumeController from "../../../https/controllers/personal_info/resume.controller.js";

const resumeRouterPublic = Router();

resumeRouterPublic.get('/', resumeController.getPublicResume);

resumeRouterPublic.get('/:id/file', resumeController.getResumeFile);

export default resumeRouterPublic;