/**
 * @openapi
 * components:
 *   schemas:
 *     OrderItemPayment:
 *       type: object
 *       required:
 *         - _id
 *         - timestamp
 *         - amount
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 *         amount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [PENDING, COMPLETED, FAILED]
 */
export interface OrderItemPayment {
    _id: string
    timestamp: string //date-time format
    amount: number
    status: 'PENDING' | 'COMPLETED' | 'FAILED'
}