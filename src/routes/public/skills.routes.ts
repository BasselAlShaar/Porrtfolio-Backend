import { Router } from "express";
import skills_categoryController from "../../https/controllers/skills/skills_category.controller.js";

const skillsRouterPublic = Router();

//Get All Skills
skillsRouterPublic.get('/', (_req, res) => {
    res.json({ message: "List skills" });
});

skillsRouterPublic.get('/categories', skills_categoryController.getAllSkillCategories)

export default skillsRouterPublic;
