import { Router } from "express"

import skills_categoryController from "../../../https/controllers/skills/skills_category.controller.js"

import validateUUID from "../../../https/middlewares/validateUUID.js";
import {
    validateCreate,
    validateUpdate
} from "../../../https/middlewares/skills/skills_category.middleware.js"

const skillsCategoryRouter = Router();

//get all
skillsCategoryRouter.get("/", skills_categoryController.getAllSkillCategories)

//create
skillsCategoryRouter.post("/", validateCreate, skills_categoryController.createSkillCategory);

//get by id
skillsCategoryRouter.get("/:id", validateUUID, skills_categoryController.getSkillCategoryById);

//update
skillsCategoryRouter.patch("/:id", validateUUID, validateUpdate, skills_categoryController.updateSkillCategory);

//delete
skillsCategoryRouter.delete("/:id", validateUUID, skills_categoryController.deleteSkillCategory);

export default skillsCategoryRouter;