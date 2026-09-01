import type { NextFunction, Request, Response } from "express";

const MAX_LENGTH = {
    full_name: 200,
    professional_title: 200,
    short_bio: 1000,
    bio: 5000,
    profile_image_url: 2048,
    location: 200,
    email: 320,
    phone: 50,
    availability_status: 100,
    availability_text: 500,
} as const;

const updateAllowedFields = [
    "full_name",
    "professional_title",
    "short_bio",
    "bio",
    "profile_image_url",
    "location",
    "email",
    "phone",
    "availability_status",
    "availability_text",
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

const isValidEmail = (value: unknown): value is string => {
    if (typeof value !== "string" || !value.trim()) {
        return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
    nullable = true
): boolean => {
    if (value === undefined) {
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
    res: Response
): boolean => {
    if (value === undefined || value === null) {
        return true;
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

const validateEmail = (
    value: unknown,
    res: Response
): boolean => {
    if (value === undefined || value === null) {
        return true;
    }

    if (!isValidEmail(value)) {
        res.status(400).json({
            message: "email must be a valid email address.",
        });

        return false;
    }

    if (value.length > MAX_LENGTH.email) {
        res.status(400).json({
            message: `email must not exceed ${MAX_LENGTH.email} characters.`,
        });

        return false;
    }

    return true;
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

    if (
        !validateStringField(
            body.full_name,
            "full_name",
            MAX_LENGTH.full_name,
            res,
            false
        )
    ) {
        return;
    }

    if (
        !validateStringField(
            body.professional_title,
            "professional_title",
            MAX_LENGTH.professional_title,
            res,
            false
        )
    ) {
        return;
    }

    if (
        !validateStringField(
            body.short_bio,
            "short_bio",
            MAX_LENGTH.short_bio,
            res
        )
    ) {
        return;
    }

    if (
        !validateStringField(
            body.bio,
            "bio",
            MAX_LENGTH.bio,
            res
        )
    ) {
        return;
    }

    if (
        !validateUrlField(
            body.profile_image_url,
            "profile_image_url",
            MAX_LENGTH.profile_image_url,
            res
        )
    ) {
        return;
    }

    if (
        !validateStringField(
            body.location,
            "location",
            MAX_LENGTH.location,
            res
        )
    ) {
        return;
    }

    if (!validateEmail(body.email, res)) {
        return;
    }

    if (
        !validateStringField(
            body.phone,
            "phone",
            MAX_LENGTH.phone,
            res
        )
    ) {
        return;
    }

    if (
        !validateStringField(
            body.availability_status,
            "availability_status",
            MAX_LENGTH.availability_status,
            res
        )
    ) {
        return;
    }

    if (
        !validateStringField(
            body.availability_text,
            "availability_text",
            MAX_LENGTH.availability_text,
            res
        )
    ) {
        return;
    }

    next();
};

export {
    validateUpdate,
};
