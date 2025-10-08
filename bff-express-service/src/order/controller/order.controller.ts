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
    console.log("[OrderController] POST - Creating a new order");

    OrderService.createOrder(req.body)
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
    const orderDto = req.body;
    console.log(`[OrderController] POST /${orderId}/pay - Paying order with id: ${orderId}`);

    OrderService.tryToBillFullOrder(orderDto)
        .then(order => {
            console.log(`[OrderController] Successfully paid order with id: ${orderId}`);
            res.status(200).json(order);
        })
        .catch(handlePromiseError(res, "OrderController.tryToBillFullOrder"));
});

/**
 * @openapi
 * /order/{id}/payment-item/{itemId}:
 *   post:
 *     summary: Pay part of an order item
 *     tags:
 *       - Order
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order item to pay part of
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderDto:
 *                 $ref: '#/components/schemas/OrderDto'
 *               payment:
 *                 $ref: '#/components/schemas/OrderItemPayment'
 *     responses:
 *       200:
 *         description: Part of the order item paid successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderDto'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post("/:id/payment-item/:itemId", (req: Request, res: Response) => {
    const orderId = req.params.id;
    const itemId = req.params.itemId;
    const {orderDto, payment} = req.body;
    console.log(`[OrderController] POST /${orderId}/payment-item/${itemId} - Paying part of order item with id: ${itemId} for order id: ${orderId}`);
    try {
        const order = OrderService.payOrderPart(orderDto, itemId, payment, orderDto.customerCount)
        console.log(`[OrderController] Successfully paid part of order item with id: ${itemId} for order id: ${orderId}`);
        res.status(200).json(order);
    } catch (error) {
        console.error(`[OrderController] Failed to pay part of order item with id: ${itemId} for order id: ${orderId}:`, error);
        handlePromiseError(res, "OrderController.payOrderPart");
    }
});

export default router;
