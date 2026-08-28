import { Router } from "express";

//Controllers import
import skillsController from "../../../https/controllers/skills/skills.controller.js";

//Middlewares import
import {
    validateCreate,
    validateUpdate
} from "../../../https/middlewares/skills/skills.middleware.js";

import validateUUID from "../../../https/middlewares/validateUUID.js";
import skillsCategoryRouter from "./skills_category.routes.js";

const skillsRouter = Router();

skillsRouter.use("/categories", skillsCategoryRouter);

//Create
skillsRouter.post(
    '/',
    validateCreate,
    skillsController.createSkill
);

//Get all Skills
skillsRouter.get(
    '/',
    skillsController.getAllSkills
);

//Get Skill by id
skillsRouter.get(
    '/:id',
    validateUUID,
    skillsController.getSkillById
);

//Update
skillsRouter.patch(
    '/:id',
    validateUUID,
    validateUpdate,
    skillsController.updateSkill
);

//Delete
skillsRouter.delete(
    '/:id',
    validateUUID,
    skillsController.deleteSkill
);

export default skillsRouter;