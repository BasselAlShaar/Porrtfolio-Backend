// ================================================================
//    PUBLIC EDUCATION ROUTES
// ================================================================
//
// Public read-only endpoints for education history.
//
// No authentication required.
//
// Frontend:
//     "Show me the education history."
//
// API:
//     "Coming right up."
//
// ================================================================
import { Router } from "express";

// ================================================================
//   CONTROLLER
// ================================================================
//
// The controller handles the HTTP request/response layer.
//
// This router only decides:
//     "Which controller handles this request?"
//
// It does NOT:
//     - Query PostgreSQL
//     - Validate business rules
//     - Transform database records
//
// Separation of concerns doing its thing.
//
// ================================================================
import educationController from "../../https/controllers/education/education.controller.js";

// ================================================================
//    ROUTER
// ================================================================
//
// Mounted at:
//
//     /api/v1/educations
//
// Which means:
//
//     GET /
//
// becomes:
//
//     GET /api/v1/educations
//
// ================================================================
const educationRouterPublic = Router();

// ================================================================
//    GET ALL EDUCATIONS
// ================================================================
//
// Returns all education records for the public portfolio.
//
// Request flow:
//
//     GET /api/v1/educations
//              ↓
//     educationController
//              ↓
//     service
//              ↓
//     repository
//              ↓
//     PostgreSQL
//
// A surprisingly long journey for "show me my degree."
//
// ================================================================

// Get All Educations
educationRouterPublic.get('/', educationController.getAllEducations);

// ================================================================
//    EXPORT
// ================================================================
//
// Education routes are ready for deployment.
//
// Hopefully the degree is worth all these routes.
//
// ================================================================
export default educationRouterPublic;