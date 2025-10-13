import {OrderingItemDto} from "./ordering-item.dto";

/**
 * @openapi
 * components:
 *   schemas:
 *     OrderingLineDto:
 *       type: object
 *       required:
 *         - item
 *         - shortName
 *         - howMany
 *         - sentForPreparation
 *       properties:
 *         item:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderingItemDto'
 *         shortName:
 *           type: string
 *         howMany:
 *           type: number
 *         sentForPreparation:
 *           type: boolean
 */
export interface OrderingLineDto {
    item: OrderingItemDto[];
    shortName: string;
    howMany: number;
    sentForPreparation: boolean;
}
