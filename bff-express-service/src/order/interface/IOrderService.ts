import {OrderDto} from "../dto/order.dto";
import {OrderItemPayment, OrderItemPaymentSaving} from "../dto/order-item-payment.dto";

export interface IOrderService {
    createOrder(order: OrderDto): Promise<string | null>;

    /**
     * Verify enough save locally if enough pay
     * @param order
     */
    tryToBillFullOrder(order: OrderDto): Promise<boolean>;

    /**
     * Save locally
     * @param order
     * @param itemId
     * @param payment
     * @param sharedBy
     */
    payOrderPart(order: OrderDto, paymentSavingList: OrderItemPaymentSaving[]): OrderDto;
}
