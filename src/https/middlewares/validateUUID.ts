import type { NextFunction, Request, Response } from "express";

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validateUUID = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({
            message: "ID is required.",
        });

        return;
    }

    if (typeof id !== "string" || !UUID_REGEX.test(id)) {
        res.status(400).json({
            message: "Invalid UUID.",
        });

        return;
    }

    next();
};

export default validateUUID;