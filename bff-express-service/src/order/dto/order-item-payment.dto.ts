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

/**
 * @openapi
 * components:
 *  schemas:
 *   OrderItemPaymentSaving:
 *    type: object
 *   required:
 *    - payment
 *   - sharedBy
 *  properties:
 *   payment:
 *    $ref: '#/components/schemas/OrderItemPayment'
 *  sharedBy:
 *   type: number
 */
export interface OrderItemPaymentSaving{
    payment: OrderItemPayment;
    sharedBy: number;
}