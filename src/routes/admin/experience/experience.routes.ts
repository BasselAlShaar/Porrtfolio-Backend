// ================================================================
//    ADMIN EXPERIENCE ROUTES
// ================================================================
//
// CRUD endpoints for managing work experiences.
//
// Unlike the public experience router, these routes allow
// the authenticated admin to modify portfolio data.
//
// Every request has already passed through requireAdmin
// in the parent admin router.
//
// So by the time we get here:
//
//     🔒 Authentication: CHECKED
//     🧠 Authorization: CHECKED
//     🗄️ Database: waiting nervously
//
// ================================================================
import { Router } from "express";

//Controllers import
import experienceController from "../../../https/controllers/experience.controller.js";

//Middlewares import
import {
    validateCreate,
    validateUpdate
} from "../../../https/middlewares/experience.middleware.js";

import validateUUID from "../../../https/middlewares/validateUUID.js";

const experienceRouter = Router();

// ================================================================
//    CREATE
// ================================================================
//
// Creates a new experience record.
//
// validateCreate handles request validation before the controller
// gets involved.
//
// No invalid data shall enter the database.
//
// ================================================================
experienceRouter.post(
    '/',
    validateCreate,
    experienceController.createExperience
);

// ================================================================
//    GET BY ID
// ================================================================
//
// Returns a single experience record.
//
// validateUUID prevents PostgreSQL from receiving:
//     "hello-i-am-definitely-not-a-uuid"
//
// ================================================================
experienceRouter.get(
    '/:id',
    validateUUID,
    experienceController.getExperienceById
);

// ================================================================
//    UPDATE
// ================================================================
//
// Partially updates an existing experience record.
//
// Order matters:
//     1. Validate UUID
//     2. Validate update payload
//     3. Run controller
//
// ================================================================
experienceRouter.patch(
    '/:id',
    validateUUID,
    validateUpdate,
    experienceController.updateExperience
);

// ================================================================
//    DELETE
// ================================================================
//
// Deletes an experience record by ID.
//
// Once this succeeds, there is no Ctrl+Z.
// PostgreSQL does not believe in second chances.
//
// ================================================================
experienceRouter.delete(
    '/:id',
    validateUUID,
    experienceController.deleteExperience
);

// ================================================================
//    EXPORT
// ================================================================
//
// Export the router for the admin route tree.
// Its job is done. Time to leave.
//
// ================================================================
export default experienceRouter;