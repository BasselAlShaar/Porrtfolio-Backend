import { Router } from "express";

import project_ImagesController from "../../../https/controllers/project/project_images.controller.js";

import validateUUID from "../../../https/middlewares/validateUUID.js";
import {
    validateCreate,
    validateUpdate
} from "../../../https/middlewares/project/project_images.middleware.js"
import validateImage from "../../../https/middlewares/imageValidator.middleware.js";

const projectImagesRouter = Router({ mergeParams: true });

projectImagesRouter.get("/", validateUUID, project_ImagesController.getAllProjectImages);
projectImagesRouter.get("/:id/file", validateUUID, project_ImagesController.getProjectImageFile);
projectImagesRouter.get("/:id", validateUUID, project_ImagesController.getById);
projectImagesRouter.post("/", validateCreate, validateImage, project_ImagesController.createProjectImage);
projectImagesRouter.patch("/:id", validateUUID, validateUpdate, project_ImagesController.updateProjectImageData);
projectImagesRouter.put("/:id", validateUUID, validateImage, project_ImagesController.updateProjectImage);
projectImagesRouter.delete("/:id", validateUUID, project_ImagesController.deleteProjectImage);

export default projectImagesRouter;