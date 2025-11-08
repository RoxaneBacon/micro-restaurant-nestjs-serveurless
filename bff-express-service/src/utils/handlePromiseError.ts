import { Response } from "express";
import axios from "axios";
import { HttpError } from "../shared/errors/http-error";

/**
 * Centralized promise rejection handler for Express routes using .then()
 */
export function handlePromiseError(res: Response, context: string) {
    return (error: any) => {
        // Handle custom HTTP errors
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({
                error: error.message,
            });
        } else if (axios.isAxiosError(error) && error.response) {
            const { status, data } = error.response;
            res.status(status || 500).json({
                error: data?.error || "UnknownError",
                details: data?.message || "An error occurred while processing the request.",
            });
        } else if (error instanceof Error) {
            res.status(500).json({
                error: "InternalServerError",
                details: error.message,
            });
        } else {
            res.status(500).json({
                error: "InternalServerError",
                details: "An unexpected error occurred.",
            });
        }
    };
}
