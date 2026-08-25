import { Router } from "express";

//Controllers import
import experienceController from "../../https/controllers/experience.controller.js";

//Middlewares import
import {
    validateCreate,
    validateUpdate
} from "../../https/middlewares/experience.middleware.js";

import validateUUID from "../../https/middlewares/validateUUID.js";

const experienceRouter = Router();

//Create
experienceRouter.post(
    '/',
    validateCreate,
    experienceController.createExperience
);

//Get by id
experienceRouter.get(
    '/:id',
    validateUUID,
    experienceController.getExperienceById
);

//Update by id
experienceRouter.patch(
    '/:id',
    validateUUID,
    validateUpdate,
    experienceController.updateExperience
);

//Delete by id
experienceRouter.delete(
    '/:id',
    validateUUID,
    experienceController.deleteExperience
);

export default experienceRouter;