// ================================================================
//    API ROUTER
// ================================================================
//
// The main routing hub.
//
// Everything eventually comes through here.
//
// Think of this as airport security:
//
//     Request
//        ↓
//     /api/v1
//        ↓
//     "Where are you going?"
//        ↓
//     /projects
//     /experiences
//     /skills
//     /admin
//     ...
//
// If a route isn't registered here,
// congratulations — it doesn't exist.
//
// ================================================================

import { Router } from 'express';

// ================================================================
//    AUTHENTICATION
// ================================================================
//
// Login/logout/session-related routes.
//
// Before accessing the admin area,
// the API needs to know who you are.
//
// Because apparently "trust me bro" isn't
// considered a valid authentication strategy.
//
// ================================================================
import authRouter from './auth.routes.js';

// ================================================================
//    ADMIN ROUTES
// ================================================================
//
// Private endpoints for managing portfolio content.
//
// Experiences.
// Projects.
// Education.
// Skills.
// Technologies.
// Whatever future me decides to add.
//
// Public users: ❌
// Admin: ✅
//
// ================================================================

// Admin Routes Imports
import adminRouter from './admin/admin.routes.js';

// ================================================================
//    PUBLIC ROUTES
// ================================================================
//
// These endpoints are safe for the public portfolio.
//
// No admin credentials required.
// No secret handshake required.
// Just GET and go.
//
// ================================================================

// Public Routes Imports
import contactRouter from './public/contact.routes.js';
import educationRouterPublic from './public/education.routes.js';
import experienceRouterPublic from './public/experience.routes.js';
import resumeRouterPublic from './public/resume.routes.js';
import technologyRouterPublic from './public//technologies/technologies.routes.js';
import skillsRouterPublic from './public/skills/skills.routes.js';
import profileRouterPublic from './public/profile.routes.js';
import projectRouterPublic from './public/project.routes.js';

// ================================================================
//    ROUTER INITIALIZATION
// ================================================================
//
// Creating the central router.
//
// This router gets mounted by the application at:
//
//     /api/v1
//
// So:
//
//     /projects
//
// becomes:
//
//     /api/v1/projects
//
// Versioning the API now saves future me from
// having an existential crisis later.
//
// ================================================================
const router = Router();

// ================================================================
//    AUTH
// ================================================================
//
// Authentication lives outside /admin because
// you need authentication before you can enter admin.
//
// Basically the bouncer is standing outside the club.
//
// ================================================================
router.use("/auth", authRouter);

// ================================================================
//    ADMIN
// ================================================================
//
// Private management API.
//
// If you made it here without being authenticated,
// something has gone terribly wrong.
//
// ================================================================
router.use("/admin", adminRouter);

// ================================================================
//    PORTFOLIO RESOURCES
// ================================================================
//
// The actual portfolio data.
//
// Each resource gets its own router so this file
// doesn't become a 900-line routing nightmare.
//
// ================================================================
router.use("/skills", skillsRouterPublic);
router.use("/technologies", technologyRouterPublic);
router.use("/projects", projectRouterPublic);
router.use("/educations", educationRouterPublic);
router.use("/experiences", experienceRouterPublic);

// ================================================================
//    CONTACT
// ================================================================
//
// Because apparently visitors need a way to say:
//
// "Hey, I saw your portfolio."
//
// Best case:
//     Job opportunity.
//
// Worst case:
//     "I can make your website for $20."
//
// ================================================================
router.use("/contact", contactRouter);

// ================================================================
//    PROFILE
// ================================================================
//
// Public profile / personal information.
//
// Yes, the portfolio is literally an API
// serving information about its owner.
//
// Very meta.
//
// ================================================================
router.use("/profiles", profileRouterPublic);

// ================================================================
//    RESUME
// ================================================================
//
// The endpoint recruiters actually care about.
//
// Please don't break this one.
//
// ================================================================
router.use("/resume", resumeRouterPublic);

// ================================================================
//    EXPORT
// ================================================================
//
// Send the fully configured router back to app.ts.
//
// app.ts:
//     "I need routes."
//
// router:
//     "I got you."
//
// ================================================================
export default router;