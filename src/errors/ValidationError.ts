import { AppError } from "./AppError.js";

export class ValidationError extends AppError {
    public readonly details?: unknown;

    constructor(
        message = "Validation failed",
        details?: unknown
    ) {
        super(
            message,
            422,
            "VALIDATION_ERROR"
        );

        this.details = details;
    }
}