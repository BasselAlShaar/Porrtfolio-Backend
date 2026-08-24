import type { NextFunction, Request, Response } from "express";

const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { password } = req.body ?? {};

    if (typeof password !== "string" || !password.trim()) {
        res.status(400).json({
            message: "Password is required.",
        });

        return;
    }

    next();
}

export default authMiddleware;