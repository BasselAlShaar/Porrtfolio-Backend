import { Router } from "express";
import technologiesCategoryRouter from "./technologies_category.routes.js";

//Controllers import
import technologiesController from "../../../https/controllers/technologies/technologies.controller.js";

//Middlewares import
import {
    validateCreate,
    validateUpdate
} from "../../../https/middlewares/technologies/technologies.middleware.js";

import validateUUID from "../../../https/middlewares/validateUUID.js";

const technologiesRouter = Router();

technologiesRouter.use("/categories", technologiesCategoryRouter);

//Create
technologiesRouter.post(
    '/',
    validateCreate,
    technologiesController.createTechnology
);

//Get all technologies
technologiesRouter.get(
    '/',
    technologiesController.getAllTechnologies
);

//Get Technology by id
technologiesRouter.get(
    '/:id',
    validateUUID,
    technologiesController.getTechnologyById
);

//Update
technologiesRouter.patch(
    '/:id',
    validateUUID,
    validateUpdate,
    technologiesController.updateTechnology
);

//Delete
technologiesRouter.delete(
    '/:id',
    validateUUID,
    technologiesController.deleteTechnology
);

export default technologiesRouter;