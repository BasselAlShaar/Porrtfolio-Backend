import { Router } from "express";

//Controllers import
import skillsCategoryController from "../../../https/controllers/skills/skills_category.controller.js";

//Middlewares import
import {
    validateCreate,
    validateUpdate
} from "../../../https/middlewares/skills/skills_category.middleware.js";

import validateUUID from "../../../https/middlewares/validateUUID.js";

const skillsCategoryRouter = Router();

//Create
skillsCategoryRouter.post(
    '/',
    validateCreate,
    skillsCategoryController.createSkillCategory
);

//Get all Skill Categories
skillsCategoryRouter.get(
    '/',
    skillsCategoryController.getAllSkillCategories
);

//Get Skill Category by id
skillsCategoryRouter.get(
    '/:id',
    validateUUID,
    skillsCategoryController.getSkillCategoryById
);

//Update
skillsCategoryRouter.patch(
    '/:id',
    validateUUID,
    validateUpdate,
    skillsCategoryController.updateSkillCategory
);

//Delete
skillsCategoryRouter.delete(
    '/:id',
    validateUUID,
    skillsCategoryController.deleteSkillCategory
);

export default skillsCategoryRouter;