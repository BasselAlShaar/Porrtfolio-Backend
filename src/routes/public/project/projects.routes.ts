import { Router } from "express";

import projectsController from "../../../https/controllers/project/projects.controller.js";

const projectRouterPublic = Router();

projectRouterPublic.get("/", projectsController.getAllPublicCards);

projectRouterPublic.get("/:slug", projectsController.getBySlugPublic);

export default projectRouterPublic;