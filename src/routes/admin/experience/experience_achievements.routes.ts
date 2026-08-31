import { Router } from "express";

import validateUUID from "../../../https/middlewares/validateUUID.js";
import experience_achievementsController from "../../../https/controllers/experience/experience_achievements.controller.js";
import { validateCreate, validateUpdate } from "../../../https/middlewares/experience/experience_achievements.middleware.js";

const experienceAchievementsRouter = Router();

experienceAchievementsRouter.get("/", experience_achievementsController.getAllExperienceAchievements);

experienceAchievementsRouter.get("/:id", validateUUID, experience_achievementsController.getExperienceAchievementById);

experienceAchievementsRouter.post("/", validateCreate, experience_achievementsController.createExperienceAchievement);

experienceAchievementsRouter.patch("/:id", validateUUID, validateUpdate, experience_achievementsController.updateExperienceAchievement);

experienceAchievementsRouter.delete("/:id", validateUUID, experience_achievementsController.deleteExperienceAchievement);

export default experienceAchievementsRouter;