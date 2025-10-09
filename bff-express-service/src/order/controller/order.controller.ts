import {Router, Request, Response} from "express";
import OrderService from "../service/order.service";
import {handlePromiseError} from "../../utils/handlePromiseError";
import {OrderDto} from "../dto/order.dto";
import {OrderItemPayment} from "../dto/order-item-payment.dto";

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
    console.log("[OrderController] POST - Creating a new order");

    OrderService.createOrder(req.body)
        .then(id => {
            console.log(`[OrderController] Successfully created order with id: ${id}`);
            res.status(201).json(id);
        })
        .catch(handlePromiseError(res, "OrderController.createOrder"));
});

/**
 * @openapi
 * /order/pay:
 *   post:
 *     summary: Pay for an existing order
 *     tags:
 *       - Order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderDto'
 *     responses:
 *       200:
 *         description: Order paid successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TableOrderDto'
 *       422:
 *         description: Unable to process payment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

router.post("/pay", (req: Request, res: Response) => {
    const orderDto: OrderDto = req.body;
    console.log(`[OrderController] POST /pay - Paying order with id: ${orderDto._id}`);

    OrderService.tryToBillFullOrder(orderDto)
        .then(result => {
            if (result) {
                console.log(`[OrderController] Successfully paid order with id: ${orderDto._id}`);
                res.status(200).json(result);
            } else {
                console.log(`[OrderController] Unable to process payment for order with id: ${orderDto._id}`);
                res.status(422).json({
                    error: "Unable to process payment",
                    message: "Order cannot be fully billed at this time"
                });
            }
        })
        .catch(handlePromiseError(res, "OrderController.tryToBillFullOrder"));
});


/**
 * @openapi
 * /order/payment-item/{itemId}:
 *   post:
 *     summary: Pay part of an order item
 *     tags:
 *       - Order
 *     parameters:
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
router.post("/payment-item/:itemId", (req: Request, res: Response) => {
    const itemId = req.params.itemId;
    const {orderDto, payment}: {orderDto: OrderDto, payment: OrderItemPayment} = req.body;
    console.log(`[OrderController] POST /payment-item/${itemId} - Paying part of order item with id: ${itemId}`);
    try {
        const order = OrderService.payOrderPart(orderDto, itemId, payment, orderDto.customerCount)
        console.log(`[OrderController] Successfully paid part of order item with id: ${itemId}`);
        res.status(200).json(order);
    } catch (error) {
        console.error(`[OrderController] Failed to pay part of order item with id: ${itemId}:`, error);
        handlePromiseError(res, "OrderController.payOrderPart");
    }
});

export default router;
