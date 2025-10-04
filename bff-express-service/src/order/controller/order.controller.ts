import {Router, Request, Response} from "express";
import OrderService from "../service/order.service";

const router = Router();

/**
 * @openapi
 * /order:
 *   post:
 *     summary: Create a new order
 *     tags:
 *       - Order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderDto'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TableOrderDto'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post("/", (req: Request, res: Response) => {
    console.log('[OrderController] POST / - Creating a new order');
    const orders = OrderService.createOrder(req.body);
    orders.then((order) => {
        console.log(`[OrderController] Successfully created order with id: ${order._id}`);
        res.status(201).json(order);
    }).catch((error) => {
        console.error(`[OrderController] Error creating order: ${error.message}`);
        res.status(500).json({error: error.message});
    });
});

/**
 * @openapi
 * /order/{id}/pay:
 *   post:
 *     summary: Pay for an existing order
 *     tags:
 *       - Order
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to pay
 *     responses:
 *       200:
 *         description: Order paid successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TableOrderDto'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post("/:id/pay", (req: Request, res: Response) => {
    const orderId = req.params.id;
    console.log(`[OrderController] POST /${orderId}/pay - Paying order with id: ${orderId}`);
    const orders = OrderService.payOrder(orderId);
    orders.then((order) => {
        console.log(`[OrderController] Successfully paid order with id: ${order._id}`);
        res.json(order);
    }).catch((error) => {
        console.error(`[OrderController] Error paying order with id ${orderId}: ${error.message}`);
        res.status(500).json({error: error.message});
    });
});

export default router;
