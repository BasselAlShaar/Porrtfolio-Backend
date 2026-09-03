import type { Request, Response, NextFunction } from "express";

const MAX_LENGTH = {
    link_type: 200,
    label: 200,
    url: 2000,
} as const;

const createAllowedFields = [
    "project_id",
    "link_type",
    "label",
    "url",
    "display_order"
] as const;

const updateAllowedFields = [
    "link_type",
    "label",
    "url",
    "display_order"
] as const;

type AllowedField = string;

const isValidUrl = (value: unknown): value is string => {
    if (typeof value !== "string" || !value.trim()) {
        return false;
    }

    try {
        const url = new URL(value);

        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        );
    } catch {
        return false;
    }
};

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

const validateUrlField = (
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
                message: `${fieldName} is required and must be a valid HTTP or HTTPS URL.`,
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
            message: `${fieldName} must be a valid HTTP or HTTPS URL..`,
        });

        return false;
    }

    if (!isValidUrl(value)) {
        res.status(400).json({
            message: `${fieldName} must be a valid HTTP or HTTPS URL.`,
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
            body.link_type,
            "link_type",
            MAX_LENGTH.link_type,
            res
        )
    ) {
        return false;
    }

    if (
        !validateStringField(
            body.label,
            "label",
            MAX_LENGTH.label,
            res
        )
    ) {
        return false;
    }

    if (
        !validateUrlField(
            body.url,
            "url",
            MAX_LENGTH.url,
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
        !validateStringField(
            body.link_type,
            "link_type",
            MAX_LENGTH.link_type,
            res,
            true,
            false
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
            body.label,
            "label",
            MAX_LENGTH.label,
            res
        )
    ) {
        return;
    }

    if (
        !validateUrlField(
            body.url,
            "url",
            MAX_LENGTH.url,
            res,
            true,
            false
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