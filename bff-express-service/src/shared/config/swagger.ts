import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

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
        // 👇 Paths to files where you’ll write Swagger JSDoc comments
        apis: ["./src/**/*.ts"],
    };

    const swaggerSpec = swaggerJsdoc(options);

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
