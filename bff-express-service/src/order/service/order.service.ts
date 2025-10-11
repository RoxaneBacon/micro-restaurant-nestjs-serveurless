import dotenv from "dotenv";
import axios from "axios";
import {OrderDto, OrderItemDto} from "../dto/order.dto";
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

    async createOrder(order: OrderDto) {
        console.log(`[OrderService] Creating order with id: ${order._id}`);

        // 1. Initialize a table with the number of customers
        const initializeTable = await axios.post(`${API_DINING_BASE}/tableOrders`, {
            tableNumber: Number(order.chevaletId),
            customersCount: order.customerCount,
        });

        console.log(`[OrderService] Initialized table ${order.chevaletId} for order ${order._id}`);

        console.log(`[OrderService] Order initialized:`, initializeTable.data);

        // 3. Add the items to the tableOrder
        const tableOrder: TableOrderDto = initializeTable.data;
        for (const item of order.items) {
            console.log(`[OrderService] Adding item ${item._id} to order ${tableOrder._id}`);

            const reponse = await axios.post(`${API_DINING_BASE}/tableOrders/${tableOrder._id}`, {
                menuItemId: item._mongoId,
                menuItemShortName: item.dish.shortName,
                howMany: item.quantity,
                ingredients: item.dish.ingredients,
            });
        }
        console.log(`[OrderService] All items added to table order ${tableOrder._id}`);
        return tableOrder._id;
    }

    tryToBillFullOrder(order: OrderDto): Promise<boolean> {
        const orderId = order._id;
        // 1. vérifier si les paiements partiels couvrent toute la commande selon ce qui stocké en mémoire
        if (!this.isOrderFullyPaid(order)) {
            // 2. si non, retourner false
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
            throw new Error(`Failed to pay for order ${orderId}: ${error}`);
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
        console.log(`Checking if item ${item._id} in order ${orderId} is fully paid.`);
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
        console.log(`[OrderService] Paying part of order item ${itemId} in order ${orderId}`);
        const item: OrderItemDto | undefined = order.items.find((i) => i._id === itemId);
        if (!item) {
            console.error(`Order item with ID ${itemId} not found`);
            return order;
        }
        if (!this.partialPaymentStorage[orderId]) {
            this.partialPaymentStorage[orderId] = {};
        }
        if (!this.partialPaymentStorage[orderId][itemId]) {
            console.log(`Creating new payment record for item ${itemId} in order ${orderId}`);
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

    private async startOrderPreparation(tableOrderId: string) {
        console.log(`[OrderService] Starting order preparation for table order id: ${tableOrderId}`);
        const response = await axios.post(`${API_DINING_BASE}/tableOrders/${tableOrderId}/prepare`);
        return response.data as PreparationDto;
    }

    private async payOrder(tableOrderId: string) {
        console.log(`[OrderService] Paying order with id: ${tableOrderId}`);

        // Start the preparation of the order
        await this.startOrderPreparation(tableOrderId);

        // Pay the order
        const response = await axios.post(`${API_DINING_BASE}/tableOrders/${tableOrderId}/bill`);
        return response.data as TableOrderDto;
    }
}

export default new OrderService();
