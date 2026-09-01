import { Router } from "express";
import personal_infoController from "../../../https/controllers/personal_info/personal_info.controller.js";

const personalInfoRouterPublic = Router();

//Get personal_info
personalInfoRouterPublic.get('/', personal_infoController.getPersonalInfo);

export default personalInfoRouterPublic;
