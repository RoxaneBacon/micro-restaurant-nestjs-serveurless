import {Router, Request, Response} from "express";
import OrderService from "../service/order.service";
import {handlePromiseError} from "../../utils/handlePromiseError";

const router = Router();

/**
 * @openapi
 * /order/{id}:
 *   post:
 *     summary: Create a new order
 *     tags:
 *       - Order
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the table for the order
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
router.post("/:id", (req: Request, res: Response) => {
    console.log("[OrderController] POST /:id - Creating a new order");

    OrderService.createOrder(parseInt(req.params.id), req.body)
        .then(order => {
            console.log(`[OrderController] Successfully created order with id: ${order._id}`);
            res.status(201).json(order);
        })
        .catch(handlePromiseError(res, "OrderController.createOrder"));
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

    OrderService.payOrder(orderId)
        .then(order => {
            console.log(`[OrderController] Successfully paid order with id: ${order._id}`);
            res.status(200).json(order);
        })
        .catch(handlePromiseError(res, "OrderController.payOrder"));
});

export default router;
