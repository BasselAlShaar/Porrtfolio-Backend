// ================================================================
//    AUTHENTICATION ROUTER
// ================================================================
//
// Handles authentication-related endpoints.
//
// Current responsibilities:
//
//     POST /admin-login
//          ↓
//     Rate Limit
//          ↓
//     Validate Credentials
//          ↓
//     Create Session
//
//     POST /logout
//          ↓
//     Check Admin Session
//          ↓
//     Destroy Session
//
// No passwords are casually wandering around this file.
// That's a good thing.
//
// ================================================================
import { Router } from "express";

// ================================================================
//    CONTROLLERS
// ================================================================
//
// Controllers handle the actual request/response logic.
//
// Router:
//     "Someone wants to log in."
//
// Controller:
//     "Alright, I'll deal with it."
//
// ================================================================

// Controller imports
import authController from "../https/controllers/auth.controller.js";

// ================================================================
//    MIDDLEWARE
// ================================================================
//
// Middleware is the security checkpoint.
//
// Before a request reaches the controller,
// it has to survive the gauntlet.
//
//     Request
//        ↓
//     Rate Limit
//        ↓
//     Authentication
//        ↓
//     Authorization
//        ↓
//     Controller
//
// Basically:
// "You shall not pass."
//
// ================================================================

// Middleware imports
import { strictLimit } from "../https/middlewares/rateLimiter.js";
import authMiddleware from "../https/middlewares/auth.middleware.js";
import requireAdmin from "../https/middlewares/requireAdmin.middleware.js";

// ================================================================
//    ROUTER
// ================================================================
//
// Creating the authentication router.
//
// This router gets mounted under:
//
//     /api/v1/auth
//
// Therefore:
//
//     /admin-login
//
// becomes:
//
//     /api/v1/auth/admin-login
//
// ================================================================
const authRouter = Router();

// ================================================================
//    ADMIN LOGIN
// ================================================================
//
// Login flow:
//
//     Client
//       ↓
//     strictLimit
//       ↓
//     authMiddleware
//       ↓
//     authController.login
//
// Rate limiting comes first so someone can't
// enthusiastically guess the password 69,000 times.
//
// authMiddleware validates the credentials.
//
// If everything checks out, the controller
// creates the authenticated session.
//
// ================================================================

// Login
authRouter.post('/admin-login', strictLimit, authMiddleware, authController.login);

// ================================================================
//    LOGOUT
// ================================================================
//
// The admin is leaving.
//
// requireAdmin makes sure the person requesting
// logout actually has an authenticated admin session.
//
// Because logging out someone who isn't logged in
// would be a little pointless.
//
// ================================================================

// Logout
authRouter.post('/logout', requireAdmin, authController.logout);

// ================================================================
//    EXPORT
// ================================================================
//
// Authentication router is ready.
//
// Please don't lose this router.
// It knows things.
//
// ================================================================
export default authRouter;