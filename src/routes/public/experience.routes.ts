import { Router } from "express";

//Controller imports
import experienceController from "../../https/controllers/experience.controller.js";

const experienceRouterPublic = Router();

//Get All
experienceRouterPublic.get('/', experienceController.getAllExperiences);

export default experienceRouterPublic;