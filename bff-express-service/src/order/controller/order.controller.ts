import { Router, Request, Response } from "express";
import OrderService from "../service/order.service";
import { handlePromiseError } from "../../utils/handlePromiseError";
import { OrderDto } from "../dto/order.dto";
import { OrderItemPaymentSaving } from "../dto/order-item-payment.dto";

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
 *             type: object
 *             required:
 *               - chevaletId
 *               - status
 *               - items
 *               - openedAt
 *               - customerCount
 *               - totalDishPrice
 *               - totalExtraPrice
 *               - totalOfferedAmount
 *               - totalPriceToPay
 *             properties:
 *               chevaletId:
 *                 type: number
 *               status:
 *                 $ref: '#/components/schemas/OrderStatus'
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItemDto'
 *               openedAt:
 *                 type: string
 *                 format: date-time
 *               customerCount:
 *                 type: number
 *               totalDishPrice:
 *                 type: number
 *               totalExtraPrice:
 *                 type: number
 *               totalOfferedAmount:
 *                 type: number
 *               totalPriceToPay:
 *                 type: number
 *               isGroup:
 *                 type: boolean
 *                 default: false
 *                 description: Whether this is a group order
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: The ID of the created table order
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post("/", (req: Request, res: Response) => {
    const isGroup: boolean = (req.query.isGroup === 'true') || false;
    const order: OrderDto = req.body.order;
    console.log(`[OrderController/order] Création d'une nouvelle commande pour la table ${order.chevaletId}`);
    OrderService.createOrder(order, isGroup)
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
 *             type: object
 *             required:
 *               - orderDto
 *             properties:
 *               orderDto:
 *                 $ref: '#/components/schemas/OrderDto'
 *     responses:
 *       200:
 *         description: Order payment status
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               description: True if order was fully paid and billed, false otherwise
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
 * /order/payment:
 *   post:
 *     summary: Pay part of an order item
 *     tags:
 *       - Order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderDto
 *               - paymentList
 *             properties:
 *               orderDto:
 *                 $ref: '#/components/schemas/OrderDto'
 *               paymentList:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItemPaymentSaving'
 *     responses:
 *       200:
 *         description: Part of the order item paid successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderDto'
 *       422:
 *         description: Unable to process payment (item not found in order)
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
router.post("/payment", (req: Request, res: Response) => {
    const { orderDto, paymentList }: { orderDto: OrderDto, paymentList: OrderItemPaymentSaving[] } = req.body;
    console.log(`[OrderController/order/payment] Traitement du paiement partiel - Commande: ${orderDto._id}`);
    try {
        let order = orderDto;
        order = OrderService.payOrderPart(order, paymentList);
        console.log(`[OrderController/order/payment] Paiement(s) partiel(s) enregistré(s) pour la commande ${order._id}`);
        res.status(200).json(order);
    } catch (error: any) {
        console.error(`[OrderController/order/payment] Erreur lors du traitement du paiement: ${error.message}`);
        res.status(422).json({
            error: "UnprocessableEntity",
            message: error.message || "Impossible de traiter le paiement"
        });
    }
});

export default router;
