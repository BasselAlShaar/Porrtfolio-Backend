import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../../errors/AppError.js";

const errorHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            error: error.message
        });
    }

    console.error(error);

    return res.status(500).json({
        error: "Internal server error"
    });
};

export default errorHandler;