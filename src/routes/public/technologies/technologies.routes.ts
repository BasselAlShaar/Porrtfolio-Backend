import { Router } from "express";

import technologiesCategoryRouterPublic from "./technologies_category.routes.js";

//Controllers import
import technologiesController from "../../../https/controllers/technologies/technologies.controller.js";

const technologiesRouterPublic = Router();

technologiesRouterPublic.use("/categories", technologiesCategoryRouterPublic);

//Get all technologies grouped by category
technologiesRouterPublic.get(
    '/',
    technologiesController.getAllTechnologiesPublic
);

export default technologiesRouterPublic;