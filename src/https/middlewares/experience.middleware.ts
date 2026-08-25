import type { Request, Response, NextFunction } from 'express';

const MAX_LENGTH = {
    company_name: 200,
    company_url: 2048,
    position: 200,
    employment_type: 200,
    location: 200,
    description: 5000,
} as const

const allowedFields = [
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
] as const

const isValidDate = (value:unknown): value is string =>{
    if (typeof value !== "string" || !value.trim()){
        return false;
    }

    const date = new Date(value);

    return !Number.isNaN(date.getTime());
};

const isValidUrl = (value: unknown): value is string =>{
    if (typeof value !== "string" || !value.trim()){
        return false;
    }

    try {
        const url = new URL(value);

        //Only allow HTTP/HTTPS URLs.
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

const validateCreate = (
    req: Request,
    res: Response,
    next: NextFunction
):void => {
    const body = req.body ?? {};

    //Reject unknown fields
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
        company_name,
        company_url,
        position,
        employment_type,
        location,
        description,
        start_date,
        end_date,
        is_current,
        display_order,
    } = body;

    //Required: company_name
    if (
        typeof company_name !== "string" ||
        !company_name.trim()
    ) {
        res.status(400).json({
            message: "Company name is required and must be a non-empty string.",
        });
    }
    if (company_name.length > MAX_LENGTH.company_name) {
            res.status(400).json({
                message: `Company name must not exceed ${MAX_LENGTH.company_name} characters.`,
            });
            return;
        }
    
        // Required: position
        if (
            typeof position !== "string" ||
            !position.trim()
        ) {
            res.status(400).json({
                message: "position is required and must be a non-empty string.",
            });
            return;
        }
    
        if (position.length > MAX_LENGTH.position) {
            res.status(400).json({
                message: `position must not exceed ${MAX_LENGTH.position} characters.`,
            });
            return;
        }
    
        // Optional: company_url
        if (company_url !== undefined && company_url !== null) {
            if (!isValidUrl(company_url)) {
                res.status(400).json({
                    message: "company url must be a valid HTTP or HTTPS URL.",
                });
                return;
            }
    
            if (company_url.length > MAX_LENGTH.company_url) {
                res.status(400).json({
                    message: `company url must not exceed ${MAX_LENGTH.company_url} characters.`,
                });
                return;
            }
        }
    
        // Optional: employment_type
        if (employment_type !== undefined && employment_type !== null) {
            if (typeof employment_type !== "string") {
                res.status(400).json({
                    message: "employment type must be a string or null.",
                });
                return;
            }
    
            if (employment_type.length > MAX_LENGTH.employment_type) {
                res.status(400).json({
                    message: `employment type must not exceed ${MAX_LENGTH.employment_type} characters.`,
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
                message: "start date must be a valid date.",
            });
            return;
        }
    
        // Optional: end_date
        if (end_date !== undefined && end_date !== null) {
            if (!isValidDate(end_date)) {
                res.status(400).json({
                    message: "end date must be a valid date or null.",
                });
                return;
            }
        }
    
        // Required: is_current
        if (typeof is_current !== "boolean") {
            res.status(400).json({
                message: "is current must be a boolean.",
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
            company_name,
            company_url,
            position,
            employment_type,
            location,
            description,
            start_date,
            end_date,
            is_current,
            display_order,
        } = body;
    
        // company_name
        if (company_name !== undefined) {
            if (
                typeof company_name !== "string" ||
                !company_name.trim()
            ) {
                res.status(400).json({
                    message: "company_name must be a non-empty string.",
                });
                return;
            }
    
            if (company_name.length > MAX_LENGTH.company_name) {
                res.status(400).json({
                    message: `company_name must not exceed ${MAX_LENGTH.company_name} characters.`,
                });
                return;
            }
        }
    
        // company_url
        if (company_url !== undefined && company_url !== null) {
            if (!isValidUrl(company_url)) {
                res.status(400).json({
                    message: "company_url must be a valid HTTP or HTTPS URL.",
                });
                return;
            }
    
            if (company_url.length > MAX_LENGTH.company_url) {
                res.status(400).json({
                    message: `company_url must not exceed ${MAX_LENGTH.company_url} characters.`,
                });
                return;
            }
        }
    
        // position
        if (position !== undefined) {
            if (
                typeof position !== "string" ||
                !position.trim()
            ) {
                res.status(400).json({
                    message: "position must be a non-empty string.",
                });
                return;
            }
    
            if (position.length > MAX_LENGTH.position) {
                res.status(400).json({
                    message: `position must not exceed ${MAX_LENGTH.position} characters.`,
                });
                return;
            }
        }
    
        // employment_type
        if (employment_type !== undefined && employment_type !== null) {
            if (typeof employment_type !== "string") {
                res.status(400).json({
                    message: "employment_type must be a string or null.",
                });
                return;
            }
    
            if (employment_type.length > MAX_LENGTH.employment_type) {
                res.status(400).json({
                    message: `employment_type must not exceed ${MAX_LENGTH.employment_type} characters.`,
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