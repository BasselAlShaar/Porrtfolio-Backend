import { Router } from "express";
import personal_infoController from "../../../https/controllers/personal_info/personal_info.controller.js";
import resumeRouterPublic from "./resume.routes.js";

const personalInfoRouterPublic = Router();

personalInfoRouterPublic.use("/resume", resumeRouterPublic);

//Get personal_info
personalInfoRouterPublic.get('/', personal_infoController.getPersonalInfo);

export default personalInfoRouterPublic;
