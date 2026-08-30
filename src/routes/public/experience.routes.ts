// ================================================================
//    PUBLIC EXPERIENCE ROUTES
// ================================================================
//
// Public read-only endpoints for work experience.
//
// No authentication required.
//
// The frontend asks:
//     "Show me Bassel's experience."
//
// This router answers:
//     "Say no more."
//
// ================================================================
import { Router } from "express";

// ================================================================
//    CONTROLLER
// ================================================================
//
// The controller handles the HTTP layer.
//
// Router:
//     "GET /"
//
// Controller:
//     "Here's your experience data."
//
// Repository/database logic stays out of this file.
//
// ================================================================

// Controller imports
import experienceController from "../../https/controllers/experience/experience.controller.js";

// ================================================================
//    ROUTER
// ================================================================
//
// This router is mounted at:
//
//     /api/v1/experiences
//
// Therefore:
//
//     GET /
//
// becomes:
//
//     GET /api/v1/experiences
//
// Simple.
// Clean.
// No suffering required.
//
// ================================================================
const experienceRouterPublic = Router();

// ================================================================
//    GET ALL EXPERIENCES
// ================================================================
//
// Returns all publicly available experiences.
//
// Controller → Service → Repository → PostgreSQL
//
// Hopefully PostgreSQL cooperates.
//
// ================================================================

// Get All
experienceRouterPublic.get('/', experienceController.getAllExperiences);

// ================================================================
//    EXPORT
// ================================================================
//
// Router ready.
// Send it upstairs.
//
// ================================================================
export default experienceRouterPublic;