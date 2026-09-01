import { Router } from "express";

import socialLinksController from "../../../https/controllers/personal_info/social_links.controller.js";
import validateUUID from "../../../https/middlewares/validateUUID.js";
import {
    validateCreate,
    validateUpdate
} from "../../../https/middlewares/personal_info/social_links.middleware.js";

const socialLinksRouter = Router();

socialLinksRouter.get('/', socialLinksController.getAllSocialLinks);
socialLinksRouter.get('/:id', validateUUID,socialLinksController.getSocialLinkById);
socialLinksRouter.post('/', validateCreate, socialLinksController.createSocialLink);
socialLinksRouter.put('/:id', validateUUID, validateUpdate, socialLinksController.updateSocialLink);
socialLinksRouter.delete('/:id', validateUUID, socialLinksController.deleteSocialLink);

export default socialLinksRouter;