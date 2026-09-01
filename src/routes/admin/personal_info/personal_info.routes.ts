import { Router } from "express";
import socialLinksRouter from "./social_links.routes.js";
import personal_infoController from "../../../https/controllers/personal_info/personal_info.controller.js";
import { validateUpdate } from "../../../https/middlewares/personal_info/personal_info.middleware.js";

const profileRouter = Router();

profileRouter.use("/links", socialLinksRouter);

//Get Profile
profileRouter.get('/', personal_infoController.getPersonalInfo);

//Update Profile
profileRouter.patch('/', validateUpdate, personal_infoController.updatePersonalInfo);

export default profileRouter;