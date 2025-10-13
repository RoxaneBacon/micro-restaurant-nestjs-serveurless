import { Router, Request, Response } from "express";
import OrderService from "../service/order.service";
import { handlePromiseError } from "../../utils/handlePromiseError";
import { OrderDto } from "../dto/order.dto";
import { OrderItemPayment, OrderItemPaymentSaving } from "../dto/order-item-payment.dto";

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
    console.log(`[OrderController/order] Création d'une nouvelle commande pour la table ${req.body.chevaletId}`);

    OrderService.createOrder(req.body)
        .then(id => {
            console.log(`[OrderController/order] Commande créée avec succès - ID commande table: ${id}`);
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
    const orderDto: OrderDto = req.body.orderDto;
    console.log(`[OrderController/order/pay] Traitement du paiement complet pour la commande ${orderDto._id}`);

    OrderService.tryToBillFullOrder(orderDto)
        .then(result => {
            if (result) {
                console.log(`[OrderController/order/pay] Commande ${orderDto._id} entièrement payée et facturée`);
            } else {
                console.log(`[OrderController/order/pay] Commande ${orderDto._id} ne peut pas être facturée - paiements insuffisants`);
            }
            res.status(200).json(result);
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
router.post("/payment", (req: Request, res: Response) => {
    const { orderDto, paymentList }: { orderDto: OrderDto, paymentList: OrderItemPaymentSaving[] } = req.body;
    console.log(`[OrderController/order/payment] Traitement du paiement partiel - Commande: ${orderDto._id}`);
    try {
        let order = orderDto;
        order = OrderService.payOrderPart(order, paymentList);
        console.log(`[OrderController/order/payment] Paiement(s) partiel(s) enregistré(s) pour la commande ${order._id}`);
        res.status(200).json(order);
    } catch (error) {
        handlePromiseError(res, "OrderController.payOrderPart");
    }
});

export default router;
