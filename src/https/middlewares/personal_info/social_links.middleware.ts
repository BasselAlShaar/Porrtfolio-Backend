import type { NextFunction, Request, Response } from "express";

const MAX_LENGTH = {
    platform: 200,
    label: 200,
    url: 2048,
    icon: 500,
    is_visible: 200,
} as const;

const createAllowedFields = [
    "platform",
    "label",
    "url",
    "icon",
    "display_order",
    "is_visible",
] as const;

const updateAllowedFields = [
    "platform",
    "label",
    "url",
    "icon",
    "display_order",
    "is_visible",
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
    res: Response,
    required = false
): boolean => {
    if (value === undefined || value === null) {
        if (required) {
            res.status(400).json({
                message: `${fieldName} is required and must be a valid HTTP or HTTPS URL.`,
            });

            return false;
        }

        return true;
    }

    if (!isValidUrl(value)) {
        res.status(400).json({
            message: `${fieldName} must be a valid HTTP or HTTPS URL.`,
        });

        return false;
    }

    if (value.length > MAX_LENGTH.url) {
        res.status(400).json({
            message: `${fieldName} must not exceed ${MAX_LENGTH.url} characters.`,
        });

        return false;
    }

    return true;
};

const validateBooleanField = (
    value: unknown,
    fieldName: string,
    res: Response,
    required = false
): boolean => {
    if (value === undefined) {
        if (required) {
            res.status(400).json({
                message: `${fieldName} must be a boolean.`,
            });

            return false;
        }

        return true;
    }

    if (typeof value !== "boolean") {
        res.status(400).json({
            message: `${fieldName} must be a boolean.`,
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

const validateCommonFields = (
    body: Record<string, unknown>,
    res: Response
): boolean => {

    if (
        !validateStringField(
            body.platform,
            "platform",
            MAX_LENGTH.platform,
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
            res
        )
    ) {
        return false;
    }

    if (
        !validateStringField(
            body.icon,
            "icon",
            MAX_LENGTH.icon,
            res
        )
    ) {
        return false;
    }

    if (
        !validateBooleanField(
            body.is_visible,
            "is_visible",
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
            body.platform,
            "platform",
            MAX_LENGTH.platform,
            res,
            true,
            false
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
            res,
            true
        )
    ) {
        return;
    }

    if (
        !validateStringField(
            body.icon,
            "icon",
            MAX_LENGTH.icon,
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

    if (
        !validateBooleanField(
            body.is_visible,
            "is_visible",
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

    if (!validateCommonFields(body, res)) {
        return;
    }

    next();
};

export {
    validateCreate,
    validateUpdate,
};
