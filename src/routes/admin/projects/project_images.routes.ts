import { Router } from "express";

import project_ImagesController from "../../../https/controllers/project/project_images.controller.js";

import validateUUID from "../../../https/middlewares/validateUUID.js";
import {
    validateCreate,
    validateUpdate
} from "../../../https/middlewares/project/project_images.middleware.js"

const projectImagesRouter = Router();

projectImagesRouter.get("/all/:id", validateUUID, project_ImagesController.getAllProjectImages);
projectImagesRouter.get("/:id", validateUUID, project_ImagesController.getById);
projectImagesRouter.post("/", validateCreate, project_ImagesController.createProjectImage);
projectImagesRouter.patch("/:id", validateUUID, validateUpdate, project_ImagesController.updateProjectImage);
projectImagesRouter.delete("/:id", validateUUID, project_ImagesController.deleteProjectImage);

export default projectImagesRouter;