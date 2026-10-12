import { Router } from "express";

import project_imagesController from "../../../../https/controllers/project/project_images.controller.js";
import validateUUID from "../../../../https/middlewares/validateUUID.js";

const project_imageRouterPublic = Router();

project_imageRouterPublic.get("/:id/file", validateUUID, project_imagesController.getProjectImageFile);

export default project_imageRouterPublic;