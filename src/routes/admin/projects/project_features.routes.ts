import { Router } from "express";

import project_FeaturesController from "../../../https/controllers/project/project_features.controller.js";

import validateUUID from "../../../https/middlewares/validateUUID.js";
import {
    validateCreate,
    validateUpdate
} from "../../../https/middlewares/project/project_features.middleware.js"

const projectFeaturesRouter = Router();

projectFeaturesRouter.get("/all/:id", validateUUID, project_FeaturesController.getAllProjectFeatures);
projectFeaturesRouter.get("/:id", validateUUID, project_FeaturesController.getById);
projectFeaturesRouter.post("/", validateCreate, project_FeaturesController.createProjectFeature);
projectFeaturesRouter.patch("/:id", validateUUID, validateUpdate, project_FeaturesController.updateProjectFeature);
projectFeaturesRouter.delete("/:id", validateUUID, project_FeaturesController.deleteProjectFeature);

export default projectFeaturesRouter;