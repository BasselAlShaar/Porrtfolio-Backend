import type { Request, Response, NextFunction } from "express";

const validateResumeFile = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const file = req.file;

    if (!file) {
        res.status(400).json({
            message: "A resume PDF file is required.",
        });
        return;
    }

    // Check the declared MIME type.
    if (file.mimetype !== "application/pdf") {
        res.status(400).json({
            message: "The resume must be a PDF file.",
        });
        return;
    }

    // Check the PDF signature (%PDF-).
    const pdfSignature = file.buffer
        .subarray(0, 5)
        .toString("ascii");

    if (pdfSignature !== "%PDF-") {
        res.status(400).json({
            message: "The uploaded file is not a valid PDF.",
        });
        return;
    }

    next();
};

export { validateResumeFile };