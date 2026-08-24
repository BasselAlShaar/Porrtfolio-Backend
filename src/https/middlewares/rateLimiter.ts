import rateLimit from "express-rate-limit";

//Limiter for public routes
export const publicLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 300, // Limit each IP to 300 requests per `window` (here, per 1 hour)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

//Limiter for admin routes
export const adminLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000, // Limit each IP to 100 requests per `window` (here, per 1 hour)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

//Limiter for auth and contact routes
export const strictLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 4, // Limit each IP to 4 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
