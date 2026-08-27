// ================================================================
//    AUTH SERVICE
// ================================================================
//
// Handles authentication-related business logic.
//
// This service is intentionally small because the actual password
// hash is stored in the environment rather than in a users table.
//
// Flow:
//
//     Controller → Auth Service → Argon2
//
// No database is needed for this particular authentication check.
//
// Keep secrets out of the source code.
// Future-us will appreciate that.
//
// ================================================================
import argon2 from "argon2";

// ================================================================
//    LOGIN
// ================================================================
//
// Verifies the supplied password against the configured Argon2 hash.
//
// The plaintext password is never stored or compared directly.
// Argon2 handles the verification using the hash's embedded parameters.
//
// Returns:
//
//     true  → password is correct
//     false → password is incorrect
//
// ================================================================
const login = async (password: string): Promise<boolean> => {
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;

    // Authentication cannot safely continue without the configured hash.
    if (!passwordHash) {
        throw new Error("ADMIN_PASSWORD_HASH is not configured.");
    }

    // Argon2 performs the secure password verification for us.
    // No manual hashing, string comparison, or questionable crypto magic.
    return argon2.verify(passwordHash, password);
};

// ================================================================
//    EXPORT
// ================================================================
//
// Export the authentication service for the controller.
//
// The controller handles the HTTP/session side of login.
// This service handles the actual password verification.
//
// Separation of concerns doing its little victory dance.
//
// ================================================================
export default {
    login,
};