import type { Request, Response, NextFunction } from "express";

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/svg+xml",
];

const validateImage = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        res.status(400).json({
            message: "Image file is required",
        });
        return;
    }

    if (!allowedMimeTypes.includes(req.file.mimetype)) {
        res.status(400).json({
            message: "Unsupported image format",
        });
        return;
    }

    next();
};

export default validateImage;