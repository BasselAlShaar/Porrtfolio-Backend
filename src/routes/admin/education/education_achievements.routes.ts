import { Router } from "express";

import validateUUID from "../../../https/middlewares/validateUUID.js";
import education_achievementsController from "../../../https/controllers/education/education_achievements.controller.js";
import { validateCreate, validateUpdate } from "../../../https/middlewares/education/education_achievements.middleware.js";

const educationAchievementsRouter = Router();

educationAchievementsRouter.get("/all/:id", validateUUID, education_achievementsController.getAllEducationAchievements);

educationAchievementsRouter.get("/:id", validateUUID, education_achievementsController.getEducationAchievementById);

educationAchievementsRouter.post("/:id", validateUUID, validateCreate, education_achievementsController.createEducationAchievement);

educationAchievementsRouter.patch("/:id", validateUUID, validateUpdate, education_achievementsController.updateEducationAchievement);

educationAchievementsRouter.delete("/:id", validateUUID, education_achievementsController.deleteEducationAchievement);

export default educationAchievementsRouter;