import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import dotenv from "dotenv";

dotenv.config();

const apiPath = process.env.SWAGGER_PATH;

export function setupSwagger(app: Express): void {
    const options: swaggerJsdoc.Options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "BFF Express Service API",
                version: "1.0.0",
                description: "API documentation for Menu and Order services",
            },
        },
        apis: ["./src/**/*.ts"],
    };

    const swaggerSpec = swaggerJsdoc(options);
    app.use(apiPath!, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
