import { Router } from "express";
import personal_infoController from "../../../https/controllers/personal_info/personal_info.controller.js";
import resumeRouterPublic from "./resume.routes.js";
import social_linksController from "../../../https/controllers/personal_info/social_links.controller.js";

const personalInfoRouterPublic = Router();

personalInfoRouterPublic.use("/resume", resumeRouterPublic);

//Get personal_info
personalInfoRouterPublic.get('/', personal_infoController.getPersonalInfoPublic);

//Get Personal Info Image
personalInfoRouterPublic.get('/file', personal_infoController.getImage)

//Get Personal Info Link Icon
personalInfoRouterPublic.get('/:id/file', social_linksController.getIcon)

export default personalInfoRouterPublic;
