import { Router } from "express";

import project_linksController from "../../../https/controllers/project/project_links.controller.js";

import validateUUID from "../../../https/middlewares/validateUUID.js";
import {
    validateCreate,
    validateUpdate
} from "../../../https/middlewares/project/project_links.middleware.js"

const projectLinksRouter = Router();

projectLinksRouter.get("/all/:id", validateUUID, project_linksController.getAllProjectLinks);
projectLinksRouter.get("/:id", validateUUID, project_linksController.getById);
projectLinksRouter.post("/", validateCreate, project_linksController.createProjectLink);
projectLinksRouter.patch("/:id", validateUUID, validateUpdate, project_linksController.updateProjectLink);
projectLinksRouter.delete("/:id", validateUUID, project_linksController.deleteProjectLink);

export default projectLinksRouter;