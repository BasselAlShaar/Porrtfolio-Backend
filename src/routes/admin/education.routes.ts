import { Router } from "express";

//Controller imports
import educationController from "../../https/controllers/education.controller.js";

//Middleware imports
import { 
    validateCreate,
    validateUpdate 
} from "../../https/middlewares/education.middleware.js";

import validateUUID from "../../https/middlewares/validateUUID.js";

const educationRouter = Router();

//Create
educationRouter.post(
    '/',
    validateCreate,
    educationController.createEducation
);

//Get by ID
educationRouter.get(
    '/:id',
    validateUUID,
    educationController.getEducationById
);

//Update
educationRouter.patch(
    '/:id',
    validateUUID,
    validateUpdate,
    educationController.updateEducation
);

//Delete
educationRouter.delete(
    '/:id',
    validateUUID,
    educationController.deleteEducation
);

export default educationRouter;