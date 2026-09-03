import type { NextFunction, Request, Response } from "express";

const MAX_LENGTH = {
    title: 200,
    slug: 200,
    short_description: 500,
    description: 5000,
    role: 200,
    problem: 500,
    solution: 500,
    project_type: 100,
    status: 100,
    project_link_type: 100,
    project_link_label: 200,
    project_link_url: 2048,
    project_image_url: 2048,
    project_image_alt_text: 200,
    project_image_caption: 500,
    project_image_type: 200,
    project_features_title: 200,
    project_features_description: 5000,
    project_challenges_title: 200,
    project_challenges_description: 5000,
    project_challenges_solution: 500
} as const;

const createAllowedFields = [
    "title",
    "slug",
    "short_description",
    "description",
    "role",
    "problem",
    "solution",
    "project_type",
    "status",
    "start_date",
    "end_date",
    "featured",
    "display_order",
    "skills",
    "technologies",
    "links",
    "images",
    "features",
    "challenges"
] as const;

const updateAllowedFields = [
    "title",
    "slug",
    "short_description",
    "description",
    "role",
    "problem",
    "solution",
    "project_type",
    "status",
    "start_date",
    "end_date",
    "featured",
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
    fieldName: string,
    maxLength: number,
    res: Response,
): boolean => {
    if (value === undefined || value === null) {
        res.status(400).json({
            message: `${fieldName} is required and must be a valid HTTP or HTTPS URL.`
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

const validateDateField = (
    value: unknown,
    fieldName: string,
    res: Response,
    required = true,
    nullable = false
): boolean => {
    if (value === undefined) {
        if (required) {
            res.status(400).json({
                message: `${fieldName} is required and must be a valid date.`,
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
    required = true
): boolean => {
    if (value === undefined) {
        if (!required) {
            return true;
        }

        res.status(400).json({
            message: `${fieldName} is required and must be a boolean.`,
        });

        return false;
    }

    if (value === null || typeof value !== "boolean") {
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

const validateLinks = (
    value: unknown,
    res: Response
): boolean => {
    if (value === undefined || value === null) {
        return true;
    }

    if (!Array.isArray(value)) {
        res.status(400).json({
            message: "links must be an array.",
        });

        return false;
    }

    for (const link of value) {
        if (
            typeof link !== "object" ||
            link === null ||
            Array.isArray(link)
        ) {
            res.status(400).json({
                message: "Each link must be an object.",
            });

            return false;
        }

        const item = link as Record<string, unknown>;

        const allowedKeys = [
            "link_type",
            "label",
            "url",
            "display_order",
        ];

        const unknownKeys = Object.keys(item).filter(
            (key) => !allowedKeys.includes(key)
        );

        if (unknownKeys.length > 0) {
            res.status(400).json({
                message: `Unknown link field(s): ${unknownKeys.join(", ")}`,
            });

            return false;
        }

        //link type
        if (
            typeof item.link_type !== "string" ||
            !item.link_type.trim()
        ) {
            res.status(400).json({
                message:
                    "Each link_type must be a non-empty string.",
            });

            return false;
        }

        if (
            item.link_type.length >
            MAX_LENGTH.project_link_type
        ) {
            res.status(400).json({
                message: `link type must not exceed ${MAX_LENGTH.project_link_type} characters.`,
            });

            return false;
        }

        //label
        if (
            item.label !== undefined &&
            item.label !== null &&
            typeof item.label !== "string"
        ) {
            res.status(400).json({
                message:
                    "Link label must be a string or null.",
            });

            return false;
        }

        if (
            typeof item.label === "string" &&
            item.label.length >
                MAX_LENGTH.project_link_label
        ) {
            res.status(400).json({
                message: `Link label must not exceed ${MAX_LENGTH.project_link_label} characters.`,
            });

            return false;
        }

        //url
        if (
            !validateUrlField(
                item.url,
                "url",
                MAX_LENGTH.project_link_url,
                res
            )
        ) {
            return false;
        }

        //display order
        if (!isNonNegativeInteger(item.display_order)) {
            res.status(400).json({
                message:
                    "Link display_order must be a non-negative integer.",
            });

            return false;
        }
    }

    return true;
};

const validateImages = (
    value: unknown,
    res: Response
): boolean => {
    if (value === undefined || value === null) {
        return true;
    }

    if (!Array.isArray(value)) {
        res.status(400).json({
            message: "Images must be an array.",
        });

        return false;
    }

    for (const image of value) {
        if (
            typeof image !== "object" ||
            image === null ||
            Array.isArray(image)
        ) {
            res.status(400).json({
                message: "Each image must be an object.",
            });

            return false;
        }

        const item = image as Record<string, unknown>;

        const allowedKeys = [
            "image_url",
            "alt_text",
            "caption",
            "image_type",
            "display_order",
        ];

        const unknownKeys = Object.keys(item).filter(
            (key) => !allowedKeys.includes(key)
        );

        if (unknownKeys.length > 0) {
            res.status(400).json({
                message: `Unknown image field(s): ${unknownKeys.join(", ")}`,
            });

            return false;
        }

        //image url
        if (
            !validateUrlField(
                item.image_url,
                "image_url",
                MAX_LENGTH.project_image_url,
                res
            )
        ) {
            return false;
        }

        //alt text
        if (
            item.alt_text !== undefined &&
            item.alt_text !== null &&
            typeof item.alt_text !== "string"
        ) {
            res.status(400).json({
                message:
                    "image alt text must be a string or null.",
            });

            return false;
        }

        if (
            typeof item.alt_text === "string" &&
            item.alt_text.length >
            MAX_LENGTH.project_image_alt_text
        ) {
            res.status(400).json({
                message: `Image alt text must not exceed ${MAX_LENGTH.project_image_alt_text} characters.`,
            });

            return false;
        }

        //caption
        if (
            item.caption !== undefined &&
            item.caption !== null &&
            typeof item.caption !== "string"
        ) {
            res.status(400).json({
                message:
                    "image caption must be a string or null.",
            });

            return false;
        }

        if (
            typeof item.caption === "string" &&
            item.caption.length >
            MAX_LENGTH.project_image_caption
        ) {
            res.status(400).json({
                message: `Image caption must not exceed ${MAX_LENGTH.project_image_caption} characters.`,
            });

            return false;
        }

        //image type
        if (
            typeof item.image_type !== "string" ||
            !item.image_type.trim()
        ) {
            res.status(400).json({
                message:
                    "Each image type must be a non-empty string.",
            });

            return false;
        }

        if (
            item.image_type.length >
            MAX_LENGTH.project_image_type
        ) {
            res.status(400).json({
                message: `Image type must not exceed ${MAX_LENGTH.project_image_type} characters.`,
            });

            return false;
        }

        //display order
        if (!isNonNegativeInteger(item.display_order)) {
            res.status(400).json({
                message:
                    "Image display_order must be a non-negative integer.",
            });

            return false;
        }
    }

    return true;
};

const validateFeatures = (
    value: unknown,
    res: Response
): boolean => {
    if (value === undefined || value === null) {
        return true;
    }

    if (!Array.isArray(value)) {
        res.status(400).json({
            message: "Features must be an array.",
        });

        return false;
    }

    for (const feature of value) {
        if (
            typeof feature !== "object" ||
            feature === null ||
            Array.isArray(feature)
        ) {
            res.status(400).json({
                message: "Each feature must be an object.",
            });

            return false;
        }

        const item = feature as Record<string, unknown>;

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
                message: `Unknown feature field(s): ${unknownKeys.join(", ")}`,
            });

            return false;
        }

        //title
        if (
            typeof item.title !== "string" ||
            !item.title.trim()
        ) {
            res.status(400).json({
                message:
                    "Each feature title must be a non-empty string.",
            });

            return false;
        }

        if (
            item.title.length >
            MAX_LENGTH.project_features_title
        ) {
            res.status(400).json({
                message: `Feature title must not exceed ${MAX_LENGTH.project_features_title} characters.`,
            });

            return false;
        }

        //description
        if (
            item.description !== undefined &&
            item.description !== null &&
            typeof item.description !== "string"
        ) {
            res.status(400).json({
                message:
                    "Feature description must be a string or null.",
            });

            return false;
        }

        if (
            typeof item.description === "string" &&
            item.description.length >
            MAX_LENGTH.project_features_description
        ) {
            res.status(400).json({
                message: `Feature description must not exceed ${MAX_LENGTH.project_features_description} characters.`,
            });

            return false;
        }

        //display order
        if (!isNonNegativeInteger(item.display_order)) {
            res.status(400).json({
                message:
                    "Feature display_order must be a non-negative integer.",
            });

            return false;
        }
    }

    return true;
};

const validateChallenges = (
    value: unknown,
    res: Response
): boolean => {
    if (value === undefined || value === null) {
        return true;
    }

    if (!Array.isArray(value)) {
        res.status(400).json({
            message: "Challenges must be an array.",
        });

        return false;
    }

    for (const challenge of value) {
        if (
            typeof challenge !== "object" ||
            challenge === null ||
            Array.isArray(challenge)
        ) {
            res.status(400).json({
                message: "Each challenge must be an object.",
            });

            return false;
        }

        const item = challenge as Record<string, unknown>;

        const allowedKeys = [
            "title",
            "description",
            "solution",
            "display_order",
        ];

        const unknownKeys = Object.keys(item).filter(
            (key) => !allowedKeys.includes(key)
        );

        if (unknownKeys.length > 0) {
            res.status(400).json({
                message: `Unknown challenges field(s): ${unknownKeys.join(", ")}`,
            });

            return false;
        }

        //title
        if (
            typeof item.title !== "string" ||
            !item.title.trim()
        ) {
            res.status(400).json({
                message:
                    "Each challenge title must be a non-empty string.",
            });

            return false;
        }

        if (
            item.title.length >
            MAX_LENGTH.project_challenges_title
        ) {
            res.status(400).json({
                message: `Challenges title must not exceed ${MAX_LENGTH.project_challenges_title} characters.`,
            });

            return false;
        }

        //description
        if (
            item.description !== undefined &&
            item.description !== null &&
            typeof item.description !== "string"
        ) {
            res.status(400).json({
                message:
                    "Challenges description must be a string or null.",
            });

            return false;
        }

        if (
            typeof item.description === "string" &&
            item.description.length >
            MAX_LENGTH.project_challenges_description
        ) {
            res.status(400).json({
                message: `Challenges description must not exceed ${MAX_LENGTH.project_challenges_description} characters.`,
            });

            return false;
        }

        //solution
        if (
            item.solution !== undefined &&
            item.solution !== null &&
            typeof item.solution !== "string"
        ) {
            res.status(400).json({
                message:
                    "Challenges solution must be a string or null.",
            });

            return false;
        }

        if (
            typeof item.solution === "string" &&
            item.solution.length >
            MAX_LENGTH.project_challenges_solution
        ) {
            res.status(400).json({
                message: `Challenges solution must not exceed ${MAX_LENGTH.project_challenges_solution} characters.`,
            });

            return false;
        }

        //display order
        if (!isNonNegativeInteger(item.display_order)) {
            res.status(400).json({
                message:
                    "Challenges display_order must be a non-negative integer.",
            });

            return false;
        }
    }

    return true;
};

const validateStatus = (
    value: unknown,
    fieldName: string,
    maxLength: number,
    res: Response,
    required = false,
    nullable = true
): boolean => {
    if (!validateStringField(
            value,
            fieldName,
            maxLength,
            res,
            required,
            nullable
        )
    ) {
        return false;
    }

    if (value === undefined || value === null) {
        return true;
    }

    if (
        value !== "completed" &&
        value !== "in_progress" &&
        value !== "archived"
    ) {

        res.status(400).json({
            message: `${fieldName} should be either completed, in_progress or archived.`
        });

        return false;
    }


    return true;
};

const validateProjectType = (
    value: unknown,
    fieldName: string,
    maxLength: number,
    res: Response,
    required = false,
    nullable = true
): boolean => {
    if (!validateStringField(
            value,
            fieldName,
            maxLength,
            res,
            required,
            nullable
        )
    ) {
        return false;
    }

    if (value === undefined || value === null) {
        return true;
    }

    if (
        value !== "personal" &&
        value !== "academic" &&
        value !== "professional" &&
        value !== "freelance" &&
        value !== "open_source" &&
        value !== "game" &&
        value !== "other"
    ) {

        res.status(400).json({
            message: `${fieldName} should be either personal, academic, professional, freelance, open_source, game or other.`
        });

        return false;
    }


    return true;
};

const validateNestedFields = (
    body: Record<string, unknown>,
    res: Response
): boolean => {
    if (
        !validateUUIDArray(
            body.skills,
            "skills",
            res
        )
    ) {
        return false;
    }

    if (
        !validateUUIDArray(
            body.technologies,
            "technologies",
            res
        )
    ) {
        return false;
    }

    if (!validateLinks(
            body.links,
            res
        )
    ) {
        return false;
    }

    if (
        !validateImages(
            body.images,
            res
        )
    ) {
        return false;
    }

    if (
        !validateFeatures(
            body.features,
            res
        )
    ) {
        return false;
    }

    if (
        !validateChallenges(
            body.challenges,
            res
        )
    ) {
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
            body.slug,
            "slug",
            MAX_LENGTH.slug,
            res
        )
    ) {
        return false;
    }

    if (
        !validateStringField(
            body.short_description,
            "short_description",
            MAX_LENGTH.short_description,
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
            body.role,
            "role",
            MAX_LENGTH.role,
            res
        )
    ) {
        return false;
    }

    if (
        !validateStringField(
            body.problem,
            "problem",
            MAX_LENGTH.problem,
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
        !validateProjectType(
            body.project_type,
            "project_type",
            MAX_LENGTH.project_type,
            res
        )
    ) {
        return false;
    }

    if (
        !validateStatus(
            body.status,
            "status",
            MAX_LENGTH.status,
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
            false,
            false
        )
    ) {
        return false;
    }

    if (
        !validateDateField(
            body.end_date,
            "end_date",
            res,
            false,
            true
        )
    ) {
        return false;
    }

    if (
        !validateBooleanField(
            body.featured,
            "featured",
            res,
            false
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
            body.slug,
            "slug",
            MAX_LENGTH.slug,
            res,
            true,
            false
        )
    ) {
        return;
    }

    if (
        !validateStringField(
            body.short_description,
            "short_description",
            MAX_LENGTH.short_description,
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
            body.role,
            "role",
            MAX_LENGTH.role,
            res
        )
    ) {
        return;
    }

    if (
        !validateStringField(
            body.problem,
            "problem",
            MAX_LENGTH.problem,
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
        !validateProjectType(
            body.project_type,
            "project_type",
            MAX_LENGTH.project_type,
            res
        )
    ) {
        return;
    }

    if (
        !validateStatus(
            body.status,
            "status",
            MAX_LENGTH.status,
            res,
            true,
            false
        )
    ) {
        return;
    }

    if (
        !validateDateField(
            body.start_date,
            "start_date",
            res,
            true,
            false
        )
    ) {
        return;
    }

    if (
        !validateDateField(
            body.end_date,
            "end_date",
            res,
            false,
            true
        )
    ) {
        return;
    }
    
    if (
        !validateBooleanField(
            body.featured,
            "featured",
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

    if (!validateUpdateFields(body, res)) {
        return;
    }

    next();
};

export {
    validateCreate,
    validateUpdate,
};