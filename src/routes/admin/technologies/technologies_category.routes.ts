import { Router } from "express";

//Controllers import
import technologiesCategoryController from "../../../https/controllers/technologies/technologies_category.controller.js";

//Middlewares import
import {
    validateCreate,
    validateUpdate
} from "../../../https/middlewares/technologies/technologies_category.middleware.js";

import validateUUID from "../../../https/middlewares/validateUUID.js";

const technologiesCategoryRouter = Router();

//Create
technologiesCategoryRouter.post(
    '/',
    validateCreate,
    technologiesCategoryController.createTechnologyCategory
);

//Get all Technology Categories
technologiesCategoryRouter.get(
    '/',
    technologiesCategoryController.getAllTechnologyCategories
);

//Get Technology Category by id
technologiesCategoryRouter.get(
    '/:id',
    validateUUID,
    technologiesCategoryController.getTechnologyCategoryById
);

//Update
technologiesCategoryRouter.patch(
    '/:id',
    validateUUID,
    validateUpdate,
    technologiesCategoryController.updateTechnologyCategory
);

//Delete
technologiesCategoryRouter.delete(
    '/:id',
    validateUUID,
    technologiesCategoryController.deleteTechnologyCategory
);

export default technologiesCategoryRouter;