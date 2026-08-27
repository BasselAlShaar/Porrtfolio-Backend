// ================================================================
//    AUTH MIDDLEWARE
// ================================================================
//
// Validates that a password was provided in the request body.
//
// This middleware only handles request validation.
// It does NOT verify whether the password is correct.
//
// Actual authentication is handled by the auth service.
//
// Flow:
//
//     Request → Validate Password → Controller → Auth Service
//
// Keep the password check here simple.
// No need to make middleware think it's smarter than it is.
//
// ================================================================
import type { NextFunction, Request, Response } from "express";

// ================================================================
//    VALIDATE PASSWORD
// ================================================================
//
// Ensures the request contains a non-empty password string.
//
// Invalid requests are rejected immediately with HTTP 400.
//
// A missing password is a malformed request, not an authentication
// failure. The actual password verification happens later.
//
// ================================================================
const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { password } = req.body ?? {};

    // Make sure password exists, is a string, and isn't just whitespace.
    if (typeof password !== "string" || !password.trim()) {
        res.status(400).json({
            message: "Password is required.",
        });

        return;
    }

    // Validation passed. Let the request continue down the pipeline.
    next();
}

// ================================================================
//    EXPORT
// ================================================================
//
// Export the middleware for use in authentication routes.
//
// Its job is simple:
//
//     Bad request → stop
//     Valid request → next()
//
// No password verification. No database calls. No wizardry.
//
// ================================================================
export default authMiddleware;