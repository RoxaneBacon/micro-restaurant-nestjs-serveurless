import dotenv from "dotenv";
import axios from "axios";
import {OrderDto, OrderItemDto} from "../dto/order.dto";
import {TableDto} from "../dto/table.dto";
import {TableOrderDto} from "../dto/table-order.dto";
import {PreparationDto} from "../dto/preparation.dto";
import {IOrderService} from "../interface/IOrderService";
import { OrderItemPayment } from "../dto/order-item-payment.dto";
import {DishDto} from "../../menu/dto/dish.dto";

dotenv.config()
const API_DINING_BASE = process.env.GATEWAY_SERVICE_URL! + process.env.GATEWAY_DINING_SERVICE_URL;

type ItemPaymentDetails = {
    price: number; // price of the item
    sharedBy: number; // number of people sharing this item
    payments: OrderItemPayment[];
};
type OrderPaymentMap = { [itemID: string]: ItemPaymentDetails };
type PartialPaymentMap = { [orderID: string]: OrderPaymentMap };

class OrderService implements IOrderService {
    partialPaymentStorage: PartialPaymentMap = {};

    tryToBillFullOrder(order: OrderDto): Promise<boolean> {
        const orderId = order._id;
        // 1. vérifier si les paiements partiels couvrent toute la commande selon ce qui stocké en mémoire
        if (!this.isOrderFullyPaid(order)) {
            // 2. si non, retourner la commande avec les paiements partiels mis à jour
            console.log(`[OrderService] Order ${orderId} is not fully paid yet.`);
            return Promise.resolve(false);
        }
        // 3. si oui, appeler l'API pour payer la commande entière
        console.log(
            `[OrderService] Order ${orderId} is fully paid. Proceeding to pay the order.`,
        );
        try {
            this.payOrder(orderId);
            return Promise.resolve(true);
        } catch (error) {
            console.error(
                `[OrderService] Failed to pay order ${orderId}:`,
                error,
            );
            return Promise.resolve(false);
        }
    }

    private isOrderFullyPaid(order: OrderDto): boolean {
        const orderPayments = this.partialPaymentStorage[order._id];
        if (!orderPayments) return false;
        for (const item of order.items) {
            if (!this.isItemFullyPaid(order._id, item)) {
                return false;
            }
        }
        return true;
    }

    private isItemFullyPaid(orderId: string, item: OrderItemDto): boolean {
        const itemPayments = this.partialPaymentStorage[orderId][item._id];
        if (!itemPayments) return false;
        const itemPrice = this.calculateOrderItemPrice(item.dish, item.quantity);
        const totalPaid = itemPayments.payments.reduce(
            (sum: number, p) => sum + p.amount,
            0,
        );
        return totalPaid >= itemPrice;
    }

    payOrderPart(order: OrderDto, itemId: string, payment: OrderItemPayment, sharedBy: number): OrderDto {
        const orderId = order._id;
        const item: OrderItemDto | undefined = order.items.find((i) => i._id === itemId);
        if (!item) {
            console.error(`Order item with ID ${itemId} not found`);
            return order;
        }
        if (!this.partialPaymentStorage[orderId]) {
            this.partialPaymentStorage[orderId] = {};
        }
        if (!this.partialPaymentStorage[orderId][itemId]) {
            this.partialPaymentStorage[orderId][itemId] = {
                sharedBy,
                payments: [],
                price: this.calculateOrderItemPrice(item.dish, item.quantity),
            };
        }
        this.partialPaymentStorage[orderId][itemId].payments.push(payment);
        payment.timestamp = new Date().toISOString();
        payment.status = "COMPLETED";
        item.payments = item.payments || [];
        item.payments.push(payment);
        item.sharedBy = sharedBy;
        item.leftToPay =
            item.price - item.payments.reduce((acc, p) => acc + p.amount, 0);
        return order;
    }

    calculateOrderItemPrice(dish: DishDto, quantity: number) {
        const extraCost = dish.ingredients.reduce((total, ingredient) => {
            return ingredient.quantity === "extra"
                ? total + ingredient.ingredient.extraCost
                : total;
        }, 0);
        const unitPrice = dish.price + extraCost;
        return unitPrice * quantity;
    }

    async createOrder(order: OrderDto) {
        console.log(`[OrderService] Creating order with id: ${order._id}`);
        // 1. Initialize a table with the number of customers
        const initializeTable = await axios.post(`${API_DINING_BASE}/${order.tableId}`, {
            tableNumber: order.tableId,
            customersCount: order.customerCount,
        });

        if (initializeTable.status !== 201) {
            throw new Error(`Failed to initialize table ${order.tableId}`);
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
        return tableOrder._id;
    }

    private async startOrderPreparation(tableOrderId: string) {
        console.log(`[OrderService] Starting order preparation for table order id: ${tableOrderId}`);
        const response = await axios.post(`${API_DINING_BASE}/tableOrders/${tableOrderId}/prepare`);
        if (response.status !== 200) {
            throw new Error(`Failed to start order preparation for table order id: ${tableOrderId}`);
        }
        return response.data as PreparationDto;
    }

    private async payOrder(tableOrderId: string) {
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
