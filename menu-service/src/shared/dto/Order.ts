import { DishDto } from "./Dish";

export type OrderStatus = "OPEN" | "PAID" | "READY" | "CLOSED";

export interface OrderItemDto {
  _id: string;
  dish: DishDto;
  quantity: number;
  price: number;
}

export interface OrderDto {
  _id: string;
  status: OrderStatus;
  items: OrderItemDto[];
  openedAt: string; // date-time format
  closedAt?: string | null; // date-time format
  customerCount: number;
}
