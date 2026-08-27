// ================================================================
//    ADMIN ROUTER
// ================================================================
//
// Welcome to the restricted section.
//
// Everything mounted here requires an authenticated admin session.
//
// Public routes:
//     "Hey, come on in."
//
// Admin routes:
//     "Password?"
//
// requireAdmin is applied ONCE at the router level,
// which means every route below automatically gets protected.
//
// No accidentally-public admin endpoints today.
//
// ================================================================
import {Router} from "express";

// ================================================================
//    ADMIN MODULES
// ================================================================
//
// Each resource gets its own router.
//
// This keeps this file focused on one job:
//
//     "Which admin resource handles this URL?"
//
// The actual CRUD logic lives deeper in the application.
//
// ================================================================
import educationRouter from "./education/education.routes.js";
import experienceRouter from "./experience/experience.routes.js";
import messageRouter from "./messages/message.routes.js";
import projectRouter from "./projects/project.routes.js";
import technologyRouter from "./technologies/technologies.routes.js";
import profileRouter from "./profile/profile.routes.js";
import skillRouter from "./skills/skills.routes.js";

// ================================================================
//    AUTHORIZATION
// ================================================================
//
// This middleware protects the ENTIRE admin router.
//
// Instead of doing:
//
//     requireAdmin, route1
//     requireAdmin, route2
//     requireAdmin, route3
//     requireAdmin, route4
//
// We do it once:
//
//     requireAdmin
//          ↓
//     EVERYTHING BELOW
//
// DRY principle:
//     Don't Repeat Yourself.
//
// Security principle:
//     Don't Accidentally Forget Yourself.
//
// ================================================================
import requireAdmin from "../../https/middlewares/requireAdmin.middleware.js";

// ================================================================
//    ROUTER INITIALIZATION
// ================================================================
//
// This router is mounted at:
//
//     /api/v1/admin
//
// So:
//
//     /educations
//
// becomes:
//
//     /api/v1/admin/educations
//
// ================================================================
const adminRouter = Router();

// ================================================================
//    ADMIN SECURITY CHECKPOINT
// ================================================================
//
// From this line downward:
//
//     YOU SHALL NOT PASS.
//
// Every request must have a valid admin session.
//
// ================================================================
adminRouter.use(requireAdmin);

// Manage education records.
adminRouter.use('/educations', educationRouter);

// Manage work experience.
adminRouter.use('/experiences', experienceRouter);

// Future me:
//     Don't forget to mark these as read.
adminRouter.use('/messages', messageRouter);

// This is where the "look what I built" section gets maintained.
adminRouter.use('/projects', projectRouter);

// Because apparently adding one new technology
// requires touching the database.
adminRouter.use('/technologies', technologyRouter);

// The API that manages the API owner's information.
// Very meta.
adminRouter.use('/profiles', profileRouter);

// Because "I know stuff" isn't a database schema.
adminRouter.use('/skills', skillRouter);

// ================================================================
//    EXPORT
// ================================================================
//
// The admin router is fully configured and protected.
//
// Everything below /admin is now behind the security gate.
//
// Good luck, unauthorized requests.
//
// ================================================================
export default adminRouter;