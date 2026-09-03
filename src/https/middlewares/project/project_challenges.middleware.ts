import type { Request, Response, NextFunction } from "express";

const MAX_LENGTH = {
    title: 200,
    description: 5000,
    solution: 500
} as const;

const createAllowedFields = [
    "project_id",
    "title",
    "description",
    "solution",
    "display_order"
] as const;

const updateAllowedFields = [
    "title",
    "description",
    "solution",
    "display_order"
] as const;

type AllowedField = string;

const isValidUUID = (value: unknown): value is string => {
    if (typeof value !== "string") {
        return false;
    }

    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value
    );
};

const isNonNegativeInteger = (value: unknown): value is number => {
    return (
        typeof value === "number" &&
        Number.isInteger(value) &&
        value >= 0
    );
};

const rejectUnknownFields = (
    body: Record<string, unknown>,
    allowedFields: readonly AllowedField[],
    res: Response
): boolean => {
    const unknownFields = Object.keys(body).filter(
        (field) => !allowedFields.includes(field)
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
    fieldName: string,
    res: Response,
    required = false
): boolean => {
    if (value === undefined) {
        if (required) {
            res.status(400).json({
                message: `${fieldName} is required and must be a valid UUID.`,
            });

            return false;
        }

        return true;
    }

    if (value === null || !isValidUUID(value)) {
        res.status(400).json({
            message: `${fieldName} must be a valid UUID.`,
        });

        return false;
    }

    return true;
};

const validateDisplayOrder = (
    value: unknown,
    res: Response,
    required = false
): boolean => {
    if (value === undefined) {
        if (required) {
            res.status(400).json({
                message: "display_order must be a non-negative integer.",
            });

            return false;
        }

        return true;
    }

    if (!isNonNegativeInteger(value)) {
        res.status(400).json({
            message: "display_order must be a non-negative integer.",
        });

        return false;
    }

    return true;
};

const validateUpdateFields = (
    body: Record<string, unknown>,
    res: Response
): boolean => {
    if (
        !validateStringField(
            body.title,
            "title",
            MAX_LENGTH.title,
            res
        )
    ) {
        return false;
    }

    if (
        !validateStringField(
            body.description,
            "description",
            MAX_LENGTH.description,
            res
        )
    ) {
        return false;
    }

    if (
        !validateStringField(
            body.solution,
            "solution",
            MAX_LENGTH.solution,
            res
        )
    ) {
        return false;
    }

    if (
        !validateDisplayOrder(
            body.display_order,
            res
        )
    ) {
        return false;
    }

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
            message: "Request body must be a JSON object.",
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

    if (
        !validateProjectId(
            body.project_id,
            "project_id",
            res,
            true
        )
    ) {
        return;
    }

    if (
        !validateStringField(
            body.title,
            "title",
            MAX_LENGTH.title,
            res,
            true,
            false
        )
    ) {
        return;
    }

    if (
        !validateStringField(
            body.description,
            "description",
            MAX_LENGTH.description,
            res
        )
    ) {
        return;
    }

    if (
        !validateStringField(
            body.solution,
            "solution",
            MAX_LENGTH.solution,
            res
        )
    ) {
        return;
    }

    if (
        !validateDisplayOrder(
            body.display_order,
            res,
            true
        )
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
    const body = req.body ?? {};

    if (
        typeof body !== "object" ||
        Array.isArray(body) ||
        body === null
    ) {
        res.status(400).json({
            message: "Request body must be a JSON object.",
        });
        return;
    }

    const providedFields = Object.keys(body);

    if (providedFields.length === 0) {
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

    if (!validateUpdateFields(body, res)) {
        return;
    }

    next();
};

export {
    validateCreate,
    validateUpdate,
};