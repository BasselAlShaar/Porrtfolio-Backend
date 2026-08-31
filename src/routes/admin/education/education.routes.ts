// ================================================================
//    ADMIN EDUCATION ROUTES
// ================================================================
//
// CRUD endpoints for managing education records.
//
// Protected by the parent admin router, so every route here
// already requires an authenticated admin session.
//
// Route flow:
//     Request → Validation → Controller → Service → Repository
//
// Keep this file focused on routing.
// Business logic belongs elsewhere.
//
// ================================================================
import { Router } from "express";

//Controller imports
import educationController from "../../../https/controllers/education/education.controller.js";

//Middleware imports
import { 
    validateCreate,
    validateUpdate 
} from "../../../https/middlewares/education/education.middleware.js";

import validateUUID from "../../../https/middlewares/validateUUID.js";
import educationAchievementsRouter from "./education_achievements.routes.js";

// My handy dandy router <3
const educationRouter = Router();

educationRouter.use("/achievements", educationAchievementsRouter);

// ================================================================
//    CREATE
// ================================================================
//
// Creates a new education record.
//
// validateCreate handles request validation before the controller
// gets involved.
//
// No invalid data shall enter the database.
//
// ================================================================
educationRouter.post(
    '/',
    validateCreate,
    educationController.createEducation
);

// ================================================================
//    GET BY ID
// ================================================================
//
// Returns a single education record.
//
// validateUUID prevents PostgreSQL from receiving:
//     "hello-i-am-definitely-not-a-uuid"
//
// ================================================================
educationRouter.get(
    '/:id',
    validateUUID,
    educationController.getEducationById
);

// ================================================================
//    UPDATE
// ================================================================
//
// Partially updates an existing education record.
//
// Order matters:
//     1. Validate UUID
//     2. Validate update payload
//     3. Run controller
//
// ================================================================
educationRouter.patch(
    '/:id',
    validateUUID,
    validateUpdate,
    educationController.updateEducation
);

// ================================================================
//    DELETE
// ================================================================
//
// Deletes an education record by ID.
//
// Once this succeeds, there is no Ctrl+Z.
// PostgreSQL does not believe in second chances.
//
// ================================================================
educationRouter.delete(
    '/:id',
    validateUUID,
    educationController.deleteEducation
);

// ================================================================
//    EXPORT
// ================================================================
//
// Export the router for the admin route tree.
// Its job is done. Time to leave.
//
// ================================================================
export default educationRouter;