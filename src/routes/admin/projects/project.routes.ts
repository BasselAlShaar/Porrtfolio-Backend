import { Router } from 'express';

import projectsController from '../../../https/controllers/project/projects.controller.js';

import {
    validateCreate,
    validateUpdate
} from "../../../https/middlewares/project/project.middleware.js";

import projectLinksRouter from "./project_links.routes.js";
import projectImagesRouter from "./project_images.routes.js";
import projectFeaturesRouter from "./project_features.routes.js";
import projectChallengesRouter from "./project_challenges.routes.js";
import validateSlug from '../../../https/middlewares/validateSlug.js';

const projectRouter = Router();

projectRouter.use("/links", projectLinksRouter)
projectRouter.use("/images", projectImagesRouter)
projectRouter.use("/features", projectFeaturesRouter)
projectRouter.use("/challenges", projectChallengesRouter)

//Get All Projects
projectRouter.get('/', projectsController.getAllCards);

//Create new Project
projectRouter.post('/', validateCreate, projectsController.createProject);

//Get Project by slug
projectRouter.get('/:slug', validateSlug, projectsController.getBySlug);

//Update Project by slug
projectRouter.patch('/:slug', validateSlug, validateUpdate, projectsController.updateProject);

//Delete Project by slug
projectRouter.delete('/:slug', validateSlug, projectsController.deleteProject);

export default projectRouter;