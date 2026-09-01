import { Router } from "express";
import socialLinksRouter from "./social_links.routes.js";

const profileRouter = Router();

profileRouter.use("/links", socialLinksRouter);

//Get Profile
profileRouter.get('/', );

//Update Profile
profileRouter.patch('/', );

export default profileRouter;