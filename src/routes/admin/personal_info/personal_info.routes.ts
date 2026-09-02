import { Router } from "express";
import socialLinksRouter from "./social_links.routes.js";
import resumeRouter from "./resume.routes.js";
import personal_infoController from "../../../https/controllers/personal_info/personal_info.controller.js";
import { validateUpdate } from "../../../https/middlewares/personal_info/personal_info.middleware.js";

const personalInfoRouter = Router();

personalInfoRouter.use("/links", socialLinksRouter);
personalInfoRouter.use("/resume", resumeRouter);

//Get Personal Info
personalInfoRouter.get('/', personal_infoController.getPersonalInfo);

//Update Personal Info
personalInfoRouter.patch('/', validateUpdate, personal_infoController.updatePersonalInfo);

export default personalInfoRouter;