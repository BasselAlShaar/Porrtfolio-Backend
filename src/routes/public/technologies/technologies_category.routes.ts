import { Router } from "express";

//Controllers import
import technologiesCategoryController from "../../../https/controllers/technologies/technologies_category.controller.js";

const technologiesCategoryRouterPublic = Router();

//Get all Technology Categories
technologiesCategoryRouterPublic.get(
    '/',
    technologiesCategoryController.getAllTechnologyCategoriesPublic
);

export default technologiesCategoryRouterPublic;