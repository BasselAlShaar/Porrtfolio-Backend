import { Router } from 'express';
import authRouter from './auth.routes.js';

//Admin Routes Imports
import adminRouter from './admin/admin.routes.js';

// Public Routes Imports
import contactRouter from './public/contact.routes.js';
import educationRouterPublic from './public/education.routes.js';
import experienceRouterPublic from './public/experience.routes.js';
import resumeRouterPublic from './public/resume.routes.js';
import technologyRouterPublic from './public/technologies.routes.js';
import skillsRouterPublic from './public/skills.routes.js';
import profileRouterPublic from './public/profile.routes.js';
import projectRouterPublic from './public/project.routes.js';

const router = Router();

router.use("/auth", authRouter);

router.use("/admin", adminRouter);
router.use("/skills", skillsRouterPublic);
router.use("/technologies", technologyRouterPublic);
router.use("/projects", projectRouterPublic);
router.use("/educations", educationRouterPublic);
router.use("/experiences", experienceRouterPublic);
router.use("/contact", contactRouter);
router.use("/profiles", profileRouterPublic);
router.use("/resume", resumeRouterPublic);


export default router;