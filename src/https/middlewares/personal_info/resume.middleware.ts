import type { NextFunction, Request, Response } from "express";

const MAX_LENGTH = {
    title: 200,
    file_name: 255,
    version: 200,
} as const;

const ALLOWED_FIELDS = [
    "title",
    "file_name",
    "version",
    "is_active",
    "display_order",
] as const;

type AllowedField = (typeof ALLOWED_FIELDS)[number];
type Body = Record<string, unknown>;

const rejectUnknownFields = (
    body: Body,
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
    body: Body,
    fieldName: "title" | "file_name" | "version",
    res: Response,
    required: boolean,
    nullable = false
): boolean => {
    const value = body[fieldName];

    if (value === undefined) {
        if (!required) return true;

        res.status(400).json({
            message: `${fieldName} is required and must be a non-empty string.`,
        });
        return false;
    }

    if (value === null && nullable) {
        return true;
    }

    if (typeof value !== "string" || !value.trim()) {
        res.status(400).json({
            message: `${fieldName} must be a non-empty string.`,
        });
        return false;
    }

    if (value.length > MAX_LENGTH[fieldName]) {
        res.status(400).json({
            message: `${fieldName} must not exceed ${MAX_LENGTH[fieldName]} characters.`,
        });
        return false;
    }

    return true;
};

const validateBooleanField = (
    body: Body,
    fieldName: "is_active",
    res: Response,
    required: boolean,
    parseString: boolean
): boolean => {
    let value = body[fieldName];

    if (value === undefined) {
        if (!required) return true;

        res.status(400).json({
            message: `${fieldName} is required and must be a boolean.`,
        });
        return false;
    }

    if (parseString && value === "true") value = true;
    if (parseString && value === "false") value = false;

    if (typeof value !== "boolean") {
        res.status(400).json({
            message: `${fieldName} must be a boolean.`,
        });
        return false;
    }

    body[fieldName] = value;
    return true;
};

const validateDisplayOrder = (
    body: Body,
    res: Response,
    required: boolean,
    parseString: boolean
): boolean => {
    const value = body.display_order;

    if (value === undefined) {
        if (!required) return true;

        res.status(400).json({
            message: "display_order is required and must be a non-negative integer.",
        });
        return false;
    }

    let parsed: number;

    if (typeof value === "number") {
        parsed = value;
    } else if (
        parseString &&
        typeof value === "string" &&
        /^\d+$/.test(value)
    ) {
        parsed = Number(value);
    } else {
        res.status(400).json({
            message: "display_order must be a non-negative integer.",
        });
        return false;
    }

    if (!Number.isSafeInteger(parsed) || parsed < 0) {
        res.status(400).json({
            message: "display_order must be a non-negative integer.",
        });
        return false;
    }

    body.display_order = parsed;
    return true;
};

const validateFields = (
    body: Body,
    res: Response,
    options: {
        required: boolean;
        parseMultipartStrings: boolean;
    }
): boolean => {
    const { required, parseMultipartStrings } = options;

    return (
        validateStringField(body, "title", res, required) &&
        validateStringField(body, "file_name", res, false) &&
        validateStringField(body, "version", res, false) &&
        validateBooleanField(
            body,
            "is_active",
            res,
            required,
            parseMultipartStrings
        ) &&
        validateDisplayOrder(
            body,
            res,
            required,
            parseMultipartStrings
        )
    );
};

const validateCreate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const body = req.body as Body | undefined;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        res.status(400).json({
            message: "Request body must be a multipart form-data object.",
        });
        return;
    }

    if (rejectUnknownFields(body, ALLOWED_FIELDS, res)) return;

    if (
        !validateFields(body, res, {
            required: true,
            parseMultipartStrings: true,
        })
    ) {
        return;
    }

    next();
};

const validateUpdate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const body = req.body as Body | undefined;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        res.status(400).json({
            message: "Request body must be a JSON object.",
        });
        return;
    }

    if (Object.keys(body).length === 0) {
        res.status(400).json({
            message: "At least one field is required.",
        });
        return;
    }

    if (rejectUnknownFields(body, ALLOWED_FIELDS, res)) return;

    if (
        !validateFields(body, res, {
            required: false,
            parseMultipartStrings: false,
        })
    ) {
        return;
    }

    next();
};

export { validateCreate, validateUpdate };