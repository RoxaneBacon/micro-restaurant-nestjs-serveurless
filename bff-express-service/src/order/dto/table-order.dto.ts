import {OrderingLineDto} from "./ordering-line.dto";
import {PreparationDto} from "./preparation.dto";

/**
 * @openapi
 * components:
 *   schemas:
 *     TableOrderDto:
 *       type: object
 *       required:
 *         - _id
 *         - tableNumber
 *         - customersCount
 *         - opened
 *         - lines
 *         - preparations
 *         - billed
 *       properties:
 *         _id:
 *           type: string
 *         tableNumber:
 *           type: number
 *         customersCount:
 *           type: number
 *         opened:
 *           type: string
 *           format: date-time
 *         lines:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderingLineDto'
 *         preparations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PreparationDto'
 *         billed:
 *           type: string
 *           format: date-time
 *           nullable: true
 */
export interface TableOrderDto {
    _id: string;
    tableNumber: number;
    customersCount: number;
    opened: Date;
    lines: OrderingLineDto[];
    preparations: PreparationDto[];
    billed: Date | null;
}
