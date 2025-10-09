import {handlePromiseError} from "./handlePromiseError";
import axios from "axios";
import type {Response} from "express";

jest.mock("axios");

describe("handlePromiseError", () => {
    let mockRes: Partial<Response>;

    beforeEach(() => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    it("should handle AxiosError with response and return backend status/data", () => {
        const mockError = {
            isAxiosError: true,
            response: {
                status: 404,
                data: {error: "TableNotFound", details: "No available table"},
            },
            message: "Not Found",
        };
        jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

        const handler = handlePromiseError(mockRes as Response, "OrderController.createOrder");
        handler(mockError);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "TableNotFound",
            details: "No available table",
        });
    });

    it("should default to 500 if AxiosError has no response", () => {
        const mockError = {
            isAxiosError: true,
            response: undefined,
            message: "An unexpected error occurred.",
        };
        jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

        const handler = handlePromiseError(mockRes as Response, "OrderController.createOrder");
        handler(mockError);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "InternalServerError",
            details: "An unexpected error occurred.",
        });
    });

    it("should handle generic Error objects", () => {
        jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

        const error = new Error("Something went wrong");
        const handler = handlePromiseError(mockRes as Response, "OrderController.payOrder");
        handler(error);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "InternalServerError",
            details: "Something went wrong",
        });
    });

    it("should handle unknown (non-error) values", () => {
        jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

        const handler = handlePromiseError(mockRes as Response, "OrderController.payOrder");
        handler("random string" as any);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "InternalServerError",
            details: "An unexpected error occurred.",
        });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
});
