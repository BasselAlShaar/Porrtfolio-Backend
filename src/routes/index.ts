import { Router } from 'express';

//Admin Routes Imports
import resumeRouter from './admin/resume.routes.js';
import messageRouter from './admin/message.routes.js';
import projectRouter from './admin/project.routes.js';
import experienceRouter from './admin/experience.routes.js';
import educationRouter from './admin/education.routes.js';
import profileRouter from './admin/profile.routes.js';
import skillRouter from './admin/skills.routes.js';
import technologyRouter from './admin/technologies.routes.js';

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


router.use("/skills", skillRouter);
router.use("/technologies", technologyRouter);


export default router;