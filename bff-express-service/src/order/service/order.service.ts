import dotenv from "dotenv";
import axios from "axios";
import {OrderDto} from "../dto/order.dto";
import {TableDto} from "../dto/table.dto";
import {TableOrderDto} from "../dto/table-order.dto";
import {PreparationDto} from "../dto/preparation.dto";

dotenv.config()
const API_DINING_BASE = process.env.GATEWAY_SERVICE_URL! + process.env.GATEWAY_DINING_SERVICE_URL;

class OrderService {

    async createOrder(tableId: number, order: OrderDto) {
        console.log(`[OrderService] Creating order with id: ${order._id}`);
        // 1. Initialize a table with the number of customers
        const initializeTable = await axios.post(`${API_DINING_BASE}/${tableId}`, {
            tableNumber: tableId,
            customersCount: order.customerCount,
        });

        if (initializeTable.status !== 201) {
            throw new Error(`Failed to initialize table ${tableId}`);
        }

        // 3. Add the items to the tableOrder
        const tableOrder = initializeTable.data;
        for (const item of order.items) {
            const reponse = await axios.post(`${API_DINING_BASE}/tableOrders/${tableOrder._id}`, {
                menuItemId: item._id,
                menuItemShortName: item.dish.shortName,
                howMany: item.quantity
            });
            console.log(`[OrderService] Added item ${item._id} to table order ${tableOrder._id}`);
            if (reponse.status !== 201) {
                // If the item is not added send an error
                throw new Error(`Failed to add item ${item._id} to table order ${tableOrder._id}`);
            }
        }
        return tableOrder as TableOrderDto;
    }

    private async startOrderPreparation(tableOrderId: string) {
        console.log(`[OrderService] Starting order preparation for table order id: ${tableOrderId}`);
        const response = await axios.post(`${API_DINING_BASE}/tableOrders/${tableOrderId}/prepare`);
        if (response.status !== 200) {
            throw new Error(`Failed to start order preparation for table order id: ${tableOrderId}`);
        }
        return response.data as PreparationDto;
    }

    async payOrder(tableOrderId: string) {
        console.log(`[OrderService] Paying order with id: ${tableOrderId}`);

        // Start the preparation of the order
        await this.startOrderPreparation(tableOrderId);

        // Pay the order
        const response = await axios.post(`${API_DINING_BASE}/tableOrders/${tableOrderId}/bill`);
        if (response.status !== 200) {
            throw new Error(`Failed to pay order with id: ${tableOrderId}`);
        }

        return response.data as TableOrderDto;
    }
}

export default new OrderService();
