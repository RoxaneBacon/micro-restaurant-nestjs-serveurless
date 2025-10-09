/**
 * @openapi
 * components:
 *   schemas:
 *     TableDto:
 *       type: object
 *       required:
 *         - _id
 *         - number
 *         - taken
 *         - tableOrderId
 *       properties:
 *         _id:
 *           type: string
 *         number:
 *           type: number
 *         taken:
 *           type: boolean
 *         tableOrderId:
 *           type: string
 *           nullable: true
 */
export interface TableDto {
    _id: string;
    number: number;
    taken: boolean;
    tableOrderId: string | null;
}
