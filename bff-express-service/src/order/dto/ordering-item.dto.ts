/**
 * @openapi
 * components:
 *   schemas:
 *     OrderingItemDto:
 *       type: object
 *       required:
 *         - _id
 *         - shortName
 *         - quantity
 *       properties:
 *         _id:
 *           type: string
 *         shortName:
 *           type: string
 *         quantity:
 *           type: string
 */
export interface OrderingItemDto {
    _id: string;
    shortName: string;
    quantity: string;
}
