import express from "express";
import bodyParser from "body-parser";
import MenuController from "./menu/controller/menu.controller";
import OrderController from "./order/controller/order.controller";
import GroupController from "./group/controller/group.controller";
import {setupSwagger} from "./shared/config/swagger";
import {connectDB} from "./shared/config/mongodb";
import dotenv from "dotenv";
import { Request } from "express";
import cors from "cors";


// Load environment variables
dotenv.config();

const app = express();
const port = process.env.APP_PORT;

app.use(cors<Request>());
app.use(bodyParser.json());

// Register controllers
app.use("/menu", MenuController);
app.use("/order", OrderController);
app.use("/group", GroupController);

// Setup Swagger
setupSwagger(app);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
        console.log(`Swagger docs at http://localhost:${port}/api-docs`);
    });
}).catch(error => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
});