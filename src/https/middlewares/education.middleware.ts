import type { NextFunction, Request, Response } from "express";

const MAX_LENGTH = {
    institution_name: 200,
    institution_url: 2048,
    degree: 200,
    field_of_study: 200,
    description: 5000,
    location: 200,
} as const;

const allowedFields = [
    "institution_name",
    "institution_url",
    "degree",
    "field_of_study",
    "description",
    "location",
    "start_date",
    "end_date",
    "is_current",
    "display_order",
] as const;

const isValidDate = (value: unknown): value is string => {
    if (typeof value !== "string" || !value.trim()) {
        return false;
    }

    const date = new Date(value);

    return !Number.isNaN(date.getTime());
};

const isValidUrl = (value: unknown): value is string => {
    if (typeof value !== "string" || !value.trim()) {
        return false;
    }

    try {
        const url = new URL(value);

        // Only allow HTTP/HTTPS URLs.
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

const validateCreate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const body = req.body ?? {};

    // Reject unknown fields
    const unknownFields = Object.keys(body).filter(
        (field) => !allowedFields.includes(
            field as (typeof allowedFields)[number]
        )
    );

    if (unknownFields.length > 0) {
        res.status(400).json({
            message: `Unknown field(s): ${unknownFields.join(", ")}`,
        });
        return;
    }

    const {
        institution_name,
        institution_url,
        degree,
        field_of_study,
        description,
        location,
        start_date,
        end_date,
        is_current,
        display_order,
    } = body;

    // Required: institution_name
    if (
        typeof institution_name !== "string" ||
        !institution_name.trim()
    ) {
        res.status(400).json({
            message: "institution_name is required and must be a non-empty string.",
        });
        return;
    }

    if (institution_name.length > MAX_LENGTH.institution_name) {
        res.status(400).json({
            message: `institution_name must not exceed ${MAX_LENGTH.institution_name} characters.`,
        });
        return;
    }

    // Required: degree
    if (
        typeof degree !== "string" ||
        !degree.trim()
    ) {
        res.status(400).json({
            message: "degree is required and must be a non-empty string.",
        });
        return;
    }

    if (degree.length > MAX_LENGTH.degree) {
        res.status(400).json({
            message: `degree must not exceed ${MAX_LENGTH.degree} characters.`,
        });
        return;
    }

    // Optional: institution_url
    if (institution_url !== undefined && institution_url !== null) {
        if (!isValidUrl(institution_url)) {
            res.status(400).json({
                message: "institution_url must be a valid HTTP or HTTPS URL.",
            });
            return;
        }

        if (institution_url.length > MAX_LENGTH.institution_url) {
            res.status(400).json({
                message: `institution_url must not exceed ${MAX_LENGTH.institution_url} characters.`,
            });
            return;
        }
    }

    // Optional: field_of_study
    if (field_of_study !== undefined && field_of_study !== null) {
        if (typeof field_of_study !== "string") {
            res.status(400).json({
                message: "field_of_study must be a string or null.",
            });
            return;
        }

        if (field_of_study.length > MAX_LENGTH.field_of_study) {
            res.status(400).json({
                message: `field_of_study must not exceed ${MAX_LENGTH.field_of_study} characters.`,
            });
            return;
        }
    }

    // Optional: description
    if (description !== undefined && description !== null) {
        if (typeof description !== "string") {
            res.status(400).json({
                message: "description must be a string or null.",
            });
            return;
        }

        if (description.length > MAX_LENGTH.description) {
            res.status(400).json({
                message: `description must not exceed ${MAX_LENGTH.description} characters.`,
            });
            return;
        }
    }

    // Optional: location
    if (location !== undefined && location !== null) {
        if (typeof location !== "string") {
            res.status(400).json({
                message: "location must be a string or null.",
            });
            return;
        }

        if (location.length > MAX_LENGTH.location) {
            res.status(400).json({
                message: `location must not exceed ${MAX_LENGTH.location} characters.`,
            });
            return;
        }
    }

    // Required: start_date
    if (!isValidDate(start_date)) {
        res.status(400).json({
            message: "start_date must be a valid date.",
        });
        return;
    }

    // Optional: end_date
    if (end_date !== undefined && end_date !== null) {
        if (!isValidDate(end_date)) {
            res.status(400).json({
                message: "end_date must be a valid date or null.",
            });
            return;
        }
    }

    // Required: is_current
    if (typeof is_current !== "boolean") {
        res.status(400).json({
            message: "is_current must be a boolean.",
        });
        return;
    }

    // Required: display_order
    if (
        typeof display_order !== "number" ||
        !Number.isInteger(display_order) ||
        display_order < 0
    ) {
        res.status(400).json({
            message: "display_order must be a non-negative integer.",
        });
        return;
    }

    next();
};

const validateUpdate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const body = req.body ?? {};

    const providedFields = Object.keys(body);

    // Reject unknown fields
    const unknownFields = providedFields.filter(
        (field) => !allowedFields.includes(
            field as (typeof allowedFields)[number]
        )
    );

    if (unknownFields.length > 0) {
        res.status(400).json({
            message: `Unknown field(s): ${unknownFields.join(", ")}`,
        });
        return;
    }

    // PATCH must contain at least one field
    if (providedFields.length === 0) {
        res.status(400).json({
            message: "At least one field is required.",
        });
        return;
    }

    const {
        institution_name,
        institution_url,
        degree,
        field_of_study,
        description,
        location,
        start_date,
        end_date,
        is_current,
        display_order,
    } = body;

    // institution_name
    if (institution_name !== undefined) {
        if (
            typeof institution_name !== "string" ||
            !institution_name.trim()
        ) {
            res.status(400).json({
                message: "institution_name must be a non-empty string.",
            });
            return;
        }

        if (institution_name.length > MAX_LENGTH.institution_name) {
            res.status(400).json({
                message: `institution_name must not exceed ${MAX_LENGTH.institution_name} characters.`,
            });
            return;
        }
    }

    // institution_url
    if (institution_url !== undefined && institution_url !== null) {
        if (!isValidUrl(institution_url)) {
            res.status(400).json({
                message: "institution_url must be a valid HTTP or HTTPS URL.",
            });
            return;
        }

        if (institution_url.length > MAX_LENGTH.institution_url) {
            res.status(400).json({
                message: `institution_url must not exceed ${MAX_LENGTH.institution_url} characters.`,
            });
            return;
        }
    }

    // degree
    if (degree !== undefined) {
        if (
            typeof degree !== "string" ||
            !degree.trim()
        ) {
            res.status(400).json({
                message: "degree must be a non-empty string.",
            });
            return;
        }

        if (degree.length > MAX_LENGTH.degree) {
            res.status(400).json({
                message: `degree must not exceed ${MAX_LENGTH.degree} characters.`,
            });
            return;
        }
    }

    // field_of_study
    if (field_of_study !== undefined && field_of_study !== null) {
        if (typeof field_of_study !== "string") {
            res.status(400).json({
                message: "field_of_study must be a string or null.",
            });
            return;
        }

        if (field_of_study.length > MAX_LENGTH.field_of_study) {
            res.status(400).json({
                message: `field_of_study must not exceed ${MAX_LENGTH.field_of_study} characters.`,
            });
            return;
        }
    }

    // description
    if (description !== undefined && description !== null) {
        if (typeof description !== "string") {
            res.status(400).json({
                message: "description must be a string or null.",
            });
            return;
        }

        if (description.length > MAX_LENGTH.description) {
            res.status(400).json({
                message: `description must not exceed ${MAX_LENGTH.description} characters.`,
            });
            return;
        }
    }

    // location
    if (location !== undefined && location !== null) {
        if (typeof location !== "string") {
            res.status(400).json({
                message: "location must be a string or null.",
            });
            return;
        }

        if (location.length > MAX_LENGTH.location) {
            res.status(400).json({
                message: `location must not exceed ${MAX_LENGTH.location} characters.`,
            });
            return;
        }
    }

    // start_date
    if (start_date !== undefined) {
        if (!isValidDate(start_date)) {
            res.status(400).json({
                message: "start_date must be a valid date.",
            });
            return;
        }
    }

    // end_date
    if (end_date !== undefined && end_date !== null) {
        if (!isValidDate(end_date)) {
            res.status(400).json({
                message: "end_date must be a valid date or null.",
            });
            return;
        }
    }

    // is_current
    if (
        is_current !== undefined &&
        typeof is_current !== "boolean"
    ) {
        res.status(400).json({
            message: "is_current must be a boolean.",
        });
        return;
    }

    // display_order
    if (display_order !== undefined) {
        if (
            typeof display_order !== "number" ||
            !Number.isInteger(display_order) ||
            display_order < 0
        ) {
            res.status(400).json({
                message: "display_order must be a non-negative integer.",
            });
            return;
        }
    }

    next();
};

export {
    validateCreate,
    validateUpdate,
};