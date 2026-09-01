import { Router } from "express";

import validateUUID from "../../../https/middlewares/validateUUID.js";
import experience_responsibilitiesController from "../../../https/controllers/experience/experience_responsibilities.controller.js";
import { validateCreate, validateUpdate } from "../../../https/middlewares/experience/experience_responsibilities.middleware.js";

const experienceResponsibilitiesRouter = Router();

experienceResponsibilitiesRouter.get("/", experience_responsibilitiesController.getAllExperienceResponsibilities);

experienceResponsibilitiesRouter.get("/:id", validateUUID, experience_responsibilitiesController.getExperienceResponsibilityById);

experienceResponsibilitiesRouter.post("/", validateCreate, experience_responsibilitiesController.createExperienceResponsibility);

experienceResponsibilitiesRouter.patch("/:id", validateUUID, validateUpdate, experience_responsibilitiesController.updateExperienceResponsibility);

experienceResponsibilitiesRouter.delete("/:id", validateUUID, experience_responsibilitiesController.deleteExperienceResponsibility);

export default experienceResponsibilitiesRouter;