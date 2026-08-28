import { Router } from "express";

import skillsCategoryRouterPublic from "./skills_category.routes.js";

//Controllers import
import skillsController from "../../../https/controllers/skills/skills.controller.js";

const skillsRouterPublic = Router();

skillsRouterPublic.use("/categories", skillsCategoryRouterPublic);

//Get all Skills grouped by category
skillsRouterPublic.get(
    '/',
    skillsController.getAllSkillsPublic
);

export default skillsRouterPublic;