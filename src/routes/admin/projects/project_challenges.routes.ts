import { Router } from "express";

import project_ChallengesController from "../../../https/controllers/project/project_challenges.controller.js";

import validateUUID from "../../../https/middlewares/validateUUID.js";
import {
    validateCreate,
    validateUpdate
} from "../../../https/middlewares/project/project_challenges.middleware.js"

const projectChallengesRouter = Router();

projectChallengesRouter.get("/all/:id", validateUUID, project_ChallengesController.getAllProjectChallenges);
projectChallengesRouter.get("/:id", validateUUID, project_ChallengesController.getById);
projectChallengesRouter.post("/", validateCreate, project_ChallengesController.createProjectChallenge);
projectChallengesRouter.patch("/:id", validateUUID, validateUpdate, project_ChallengesController.updateProjectChallenge);
projectChallengesRouter.delete("/:id", validateUUID, project_ChallengesController.deleteProjectChallenge);

export default projectChallengesRouter;