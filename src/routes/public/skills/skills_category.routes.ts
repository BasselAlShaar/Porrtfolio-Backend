import { Router } from "express";

//Controllers import
import skillsCategoryController from "../../../https/controllers/skills/skills_category.controller.js";

const skillsCategoryRouterPublic = Router();

//Get all Skill Categories
skillsCategoryRouterPublic.get(
    '/',
    skillsCategoryController.getAllSkillCategoriesPublic
);

export default skillsCategoryRouterPublic;