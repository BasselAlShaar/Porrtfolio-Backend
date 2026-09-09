import type { Request, Response, NextFunction } from "express";

const MAX_LENGTH = {
    alt_text: 200,
    caption: 200,
    image_type: 200,
} as const;

const createAllowedFields = [
    "project_id",
    "alt_text",
    "caption",
    "image_type",
    "display_order",
] as const;

const updateAllowedFields = [
    "alt_text",
    "caption",
    "image_type",
    "display_order",
] as const;

type AllowedField =
    | typeof createAllowedFields[number]
    | typeof updateAllowedFields[number];

const isValidUUID = (value: unknown): value is string => {
    if (typeof value !== "string") {
        return false;
    }

    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value
    );
};

const parseNonNegativeInteger = (
    value: unknown
): number | null => {
    if (typeof value === "number") {
        return Number.isInteger(value) && value >= 0
            ? value
            : null;
    }

    if (
        typeof value === "string" &&
        /^\d+$/.test(value)
    ) {
        const parsed = Number(value);

        return Number.isSafeInteger(parsed)
            ? parsed
            : null;
    }

    return null;
};

const rejectUnknownFields = (
    body: Record<string, unknown>,
    allowedFields: readonly AllowedField[],
    res: Response
): boolean => {
    const unknownFields = Object.keys(body).filter(
        (field) => !allowedFields.includes(field as AllowedField)
    );

    if (unknownFields.length === 0) {
        return false;
    }

    res.status(400).json({
        message: `Unknown field(s): ${unknownFields.join(", ")}`,
    });

    return true;
};

const validateStringField = (
    value: unknown,
    fieldName: string,
    maxLength: number,
    res: Response,
    required = false,
    nullable = true
): boolean => {
    if (value === undefined) {
        if (required) {
            res.status(400).json({
                message: `${fieldName} is required and must be a non-empty string.`,
            });

            return false;
        }

        return true;
    }

    if (value === null) {
        if (nullable) {
            return true;
        }

        res.status(400).json({
            message: `${fieldName} must be a non-empty string.`,
        });

        return false;
    }

    if (typeof value !== "string" || !value.trim()) {
        res.status(400).json({
            message: `${fieldName} must be a non-empty string.`,
        });

        return false;
    }

    if (value.length > maxLength) {
        res.status(400).json({
            message: `${fieldName} must not exceed ${maxLength} characters.`,
        });

        return false;
    }

    return true;
};

const validateProjectId = (
    value: unknown,
    res: Response
): boolean => {
    if (!isValidUUID(value)) {
        res.status(400).json({
            message: "project_id must be a valid UUID.",
        });

        return false;
    }

    return true;
};

const validateDisplayOrder = (
    req: Request,
    res: Response,
    required = false
): boolean => {
    const value = req.body.display_order;

    if (value === undefined) {
        if (required) {
            res.status(400).json({
                message:
                    "display_order must be a non-negative integer.",
            });

            return false;
        }

        return true;
    }

    const parsed = parseNonNegativeInteger(value);

    if (parsed === null) {
        res.status(400).json({
            message:
                "display_order must be a non-negative integer.",
        });

        return false;
    }

    // Normalize multipart/form-data value from string to number.
    req.body.display_order = parsed;

    return true;
};

const validateCreate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const body = req.body ?? {};

    if (
        typeof body !== "object" ||
        Array.isArray(body) ||
        body === null
    ) {
        res.status(400).json({
            message: "Request body must be an object.",
        });
        return;
    }

    if (
        rejectUnknownFields(
            body,
            createAllowedFields,
            res
        )
    ) {
        return;
    }

    if (!validateProjectId(body.project_id, res)) {
        return;
    }

    if (
        !validateStringField(
            body.alt_text,
            "alt_text",
            MAX_LENGTH.alt_text,
            res
        )
    ) {
        return;
    }

    if (
        !validateStringField(
            body.caption,
            "caption",
            MAX_LENGTH.caption,
            res
        )
    ) {
        return;
    }

    if (
        !validateStringField(
            body.image_type,
            "image_type",
            MAX_LENGTH.image_type,
            res,
            true,
            false
        )
    ) {
        return;
    }

    if (!validateDisplayOrder(req, res, true)) {
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

    if (
        typeof body !== "object" ||
        Array.isArray(body) ||
        body === null
    ) {
        res.status(400).json({
            message: "Request body must be an object.",
        });
        return;
    }

    if (Object.keys(body).length === 0) {
        res.status(400).json({
            message: "At least one field is required.",
        });
        return;
    }

    if (
        rejectUnknownFields(
            body,
            updateAllowedFields,
            res
        )
    ) {
        return;
    }

    if (
        !validateStringField(
            body.alt_text,
            "alt_text",
            MAX_LENGTH.alt_text,
            res
        )
    ) {
        return;
    }

    if (
        !validateStringField(
            body.caption,
            "caption",
            MAX_LENGTH.caption,
            res
        )
    ) {
        return;
    }

    if (
        !validateStringField(
            body.image_type,
            "image_type",
            MAX_LENGTH.image_type,
            res
        )
    ) {
        return;
    }

    if (!validateDisplayOrder(req, res)) {
        return;
    }

    next();
};

export {
    validateCreate,
    validateUpdate,
};