import {DishDto} from "../../menu/dto/dish.dto";
import {IngredientDto} from "../../menu/dto/ingredient.dto";
import {OrderItemPayment} from "./order-item-payment.dto";

/**
 * @openapi
 * components:
 *   schemas:
 *     OrderStatus:
 *       type: string
 *       enum: [OPEN, PAID, READY, CLOSED]
 *       description: "Available statuses for orders"
 */
export type OrderStatus = "OPEN" | "PAID" | "READY" | "CLOSED";

/**
 * @openapi
 * components:
 *   schemas:
 *     OrderItemDto:
 *       type: object
 *       required:
 *         - _id
 *         - dish
 *         - quantity
 *         - price
 *         - extra_list
 *       properties:
 *         _id:
 *           type: string
 *         dish:
 *           $ref: '#/components/schemas/DishDto'
 *         quantity:
 *           type: number
 *         price:
 *           type: number
 *         extra_list:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/IngredientDto'
 */
export interface OrderItemDto {
    _id: string
    _mongoId: string
    dish: DishDto
    quantity: number
    price: number
    payments?: OrderItemPayment[]
    sharedBy?: number
    leftToPay: number
}

/**
 * @openapi
 * components:
 *   schemas:
 *     OrderDto:
 *       type: object
 *       required:
 *         - _id
 *         - status
 *         - items
 *         - openedAt
 *         - customerCount
 *       properties:
 *         _id:
 *           type: string
 *         status:
 *           $ref: '#/components/schemas/OrderStatus'
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItemDto'
 *         openedAt:
 *           type: string
 *           format: date-time
 *         closedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         customerCount:
 *           type: number
 */
export interface OrderDto {
    _id: string;
    tableId: number;
    status: OrderStatus;
    items: OrderItemDto[];
    openedAt: string; // date-time format
    closedAt?: string | null; // date-time format
    customerCount: number;
}
