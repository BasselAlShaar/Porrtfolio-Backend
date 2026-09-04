import type { NextFunction, Request, Response } from "express";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const validateSlug = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { slug } = req.params;

    if (!slug) {
        res.status(400).json({
            message: "slug is required.",
        });

        return;
    }

    if (typeof slug !== "string" || !SLUG_REGEX.test(slug)) {
        res.status(400).json({
            message: "Invalid Slug.",
        });

        return;
    }

    next();
};

export default validateSlug;