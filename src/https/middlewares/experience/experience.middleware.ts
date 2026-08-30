import type { NextFunction, Request, Response } from "express";

const MAX_LENGTH = {
    company_name: 200,
    company_url: 2048,
    position: 200,
    employment_type: 200,
    location: 200,
    description: 5000,
    achievement_title: 200,
    achievement_description: 5000,
    responsibility_description: 5000,
} as const;

const createAllowedFields = [
    "company_name",
    "company_url",
    "position",
    "employment_type",
    "location",
    "description",
    "start_date",
    "end_date",
    "is_current",
    "display_order",
    "skill_ids",
    "technology_ids",
    "achievements",
    "responsibilities",
] as const;

const updateAllowedFields = [
    "company_name",
    "company_url",
    "position",
    "employment_type",
    "location",
    "description",
    "start_date",
    "end_date",
    "is_current",
    "display_order",
] as const;

type AllowedField = string;

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
    res: Response
): boolean => {
    if (value === undefined || value === null) {
        return true;
    }

    if (!isValidUrl(value)) {
        res.status(400).json({
            message: "company_url must be a valid HTTP or HTTPS URL.",
        });

        return false;
    }

    if (value.length > MAX_LENGTH.company_url) {
        res.status(400).json({
            message: `company_url must not exceed ${MAX_LENGTH.company_url} characters.`,
        });

        return false;
    }

    return true;
};

const validateDateField = (
    value: unknown,
    fieldName: string,
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
            message: `${fieldName} must be a valid date.`,
        });

        return false;
    }

    if (!isValidDate(value)) {
        res.status(400).json({
            message: `${fieldName} must be a valid date${nullable ? " or null" : ""}.`,
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

const validateUUIDArray = (
    value: unknown,
    fieldName: string,
    res: Response
): boolean => {
    if (value === undefined || value === null) {
        return true;
    }

    if (
        !Array.isArray(value) ||
        !value.every((id) => isValidUUID(id))
    ) {
        res.status(400).json({
            message: `${fieldName} must be an array of valid UUIDs.`,
        });

        return false;
    }

    return true;
};

const validateAchievements = (
    value: unknown,
    res: Response
): boolean => {
    if (value === undefined || value === null) {
        return true;
    }

    if (!Array.isArray(value)) {
        res.status(400).json({
            message: "achievements must be an array.",
        });

        return false;
    }

    for (const achievement of value) {
        if (
            typeof achievement !== "object" ||
            achievement === null ||
            Array.isArray(achievement)
        ) {
            res.status(400).json({
                message: "Each achievement must be an object.",
            });

            return false;
        }

        const item = achievement as Record<string, unknown>;

        const allowedKeys = [
            "title",
            "description",
            "display_order",
        ];

        const unknownKeys = Object.keys(item).filter(
            (key) => !allowedKeys.includes(key)
        );

        if (unknownKeys.length > 0) {
            res.status(400).json({
                message: `Unknown achievement field(s): ${unknownKeys.join(", ")}`,
            });

            return false;
        }

        if (
            typeof item.title !== "string" ||
            !item.title.trim()
        ) {
            res.status(400).json({
                message:
                    "Each achievement title must be a non-empty string.",
            });

            return false;
        }

        if (
            item.title.length >
            MAX_LENGTH.achievement_title
        ) {
            res.status(400).json({
                message: `Achievement title must not exceed ${MAX_LENGTH.achievement_title} characters.`,
            });

            return false;
        }

        if (
            item.description !== undefined &&
            item.description !== null &&
            typeof item.description !== "string"
        ) {
            res.status(400).json({
                message:
                    "Achievement description must be a string or null.",
            });

            return false;
        }

        if (
            typeof item.description === "string" &&
            item.description.length >
                MAX_LENGTH.achievement_description
        ) {
            res.status(400).json({
                message: `Achievement description must not exceed ${MAX_LENGTH.achievement_description} characters.`,
            });

            return false;
        }

        if (!isNonNegativeInteger(item.display_order)) {
            res.status(400).json({
                message:
                    "Achievement display_order must be a non-negative integer.",
            });

            return false;
        }
    }

    return true;
};

const validateResponsibilities = (
    value: unknown,
    res: Response
): boolean => {
    if (value === undefined || value === null) {
        return true;
    }

    if (!Array.isArray(value)) {
        res.status(400).json({
            message: "responsibilities must be an array.",
        });

        return false;
    }

    for (const responsibility of value) {
        if (
            typeof responsibility !== "object" ||
            responsibility === null ||
            Array.isArray(responsibility)
        ) {
            res.status(400).json({
                message: "Each responsibility must be an object.",
            });

            return false;
        }

        const item = responsibility as Record<string, unknown>;

        const allowedKeys = [
            "description",
            "display_order",
        ];

        const unknownKeys = Object.keys(item).filter(
            (key) => !allowedKeys.includes(key)
        );

        if (unknownKeys.length > 0) {
            res.status(400).json({
                message: `Unknown responsibility field(s): ${unknownKeys.join(", ")}`,
            });

            return false;
        }

        if (
            typeof item.description !== "string" ||
            !item.description.trim()
        ) {
            res.status(400).json({
                message:
                    "Each responsibility description must be a non-empty string.",
            });

            return false;
        }

        if (
            item.description.length >
            MAX_LENGTH.responsibility_description
        ) {
            res.status(400).json({
                message: `Responsibility description must not exceed ${MAX_LENGTH.responsibility_description} characters.`,
            });

            return false;
        }

        if (!isNonNegativeInteger(item.display_order)) {
            res.status(400).json({
                message:
                    "Responsibility display_order must be a non-negative integer.",
            });

            return false;
        }
    }

    return true;
};

const validateNestedFields = (
    body: Record<string, unknown>,
    res: Response
): boolean => {
    if (
        !validateUUIDArray(
            body.skill_ids,
            "skill_ids",
            res
        )
    ) {
        return false;
    }

    if (
        !validateUUIDArray(
            body.technology_ids,
            "technology_ids",
            res
        )
    ) {
        return false;
    }

    if (!validateAchievements(body.achievements, res)) {
        return false;
    }

    if (
        !validateResponsibilities(
            body.responsibilities,
            res
        )
    ) {
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
            body.company_name,
            "company_name",
            MAX_LENGTH.company_name,
            res
        )
    ) {
        return false;
    }

    if (!validateUrlField(body.company_url, res)) {
        return false;
    }

    if (
        !validateStringField(
            body.position,
            "position",
            MAX_LENGTH.position,
            res
        )
    ) {
        return false;
    }

    if (
        !validateStringField(
            body.employment_type,
            "employment_type",
            MAX_LENGTH.employment_type,
            res
        )
    ) {
        return false;
    }

    if (
        !validateStringField(
            body.location,
            "location",
            MAX_LENGTH.location,
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
        !validateDateField(
            body.start_date,
            "start_date",
            res,
            false
        )
    ) {
        return false;
    }

    if (
        !validateDateField(
            body.end_date,
            "end_date",
            res
        )
    ) {
        return false;
    }

    if (
        !validateBooleanField(
            body.is_current,
            "is_current",
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
            body.company_name,
            "company_name",
            MAX_LENGTH.company_name,
            res,
            true,
            false
        )
    ) {
        return;
    }

    if (
        !validateStringField(
            body.position,
            "position",
            MAX_LENGTH.position,
            res,
            true,
            false
        )
    ) {
        return;
    }

    if (!validateCommonFields(body, res)) {
        return;
    }

    if (
        !validateBooleanField(
            body.is_current,
            "is_current",
            res,
            true
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

    if (!validateNestedFields(body, res)) {
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