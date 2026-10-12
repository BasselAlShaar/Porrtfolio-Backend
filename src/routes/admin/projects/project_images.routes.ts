import { Router } from "express";

import project_ImagesController from "../../../https/controllers/project/project_images.controller.js";

import validateUUID from "../../../https/middlewares/validateUUID.js";
import {
    validateCreate,
    validateUpdate
} from "../../../https/middlewares/project/project_images.middleware.js"
import validateImage from "../../../https/middlewares/imageValidator.middleware.js";
import upload from "../../../https/middlewares/upload.js";

const projectImagesRouter = Router({ mergeParams: true });

projectImagesRouter.get("/", project_ImagesController.getAllProjectImages);
projectImagesRouter.get("/:id", validateUUID, project_ImagesController.getById);
projectImagesRouter.post("/", upload.single("file"), validateCreate, validateImage, project_ImagesController.createProjectImage);
projectImagesRouter.patch("/:id", validateUUID, validateUpdate, project_ImagesController.updateProjectImageData);
projectImagesRouter.put("/:id", validateUUID, upload.single("file"), validateImage, project_ImagesController.updateProjectImage);
projectImagesRouter.delete("/:id", validateUUID, project_ImagesController.deleteProjectImage);

export default projectImagesRouter;