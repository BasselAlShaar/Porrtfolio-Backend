import {Router} from "express";

import educationRouter from "./education.routes.js";
import experienceRouter from "./experience.routes.js";
import messageRouter from "./message.routes.js";
import projectRouter from "./project.routes.js";
import technologyRouter from "./technologies.routes.js";
import profileRouter from "./profile.routes.js";
import skillRouter from "./skills.routes.js";
import requireAdmin from "../../https/middlewares/requireAdmin.middleware.js";

const adminRouter = Router();

adminRouter.use(requireAdmin);

adminRouter.use('/educations', educationRouter);
adminRouter.use('/experiences', experienceRouter);
adminRouter.use('/messages', messageRouter);
adminRouter.use('/projects', projectRouter);
adminRouter.use('/technologies', technologyRouter);
adminRouter.use('/profiles', profileRouter);
adminRouter.use('/skills', skillRouter);

export default adminRouter;