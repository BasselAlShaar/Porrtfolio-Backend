import { Router } from "express";

import projectsController from "../../../https/controllers/project/projects.controller.js";
import validateSlug from "../../../https/middlewares/validateSlug.js";

const projectRouterPublic = Router();

projectRouterPublic.get("/", projectsController.getAllPublicCards);

projectRouterPublic.get("/:slug", validateSlug, projectsController.getBySlugPublic);

export default projectRouterPublic;