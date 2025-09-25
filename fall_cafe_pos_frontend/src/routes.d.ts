/**
 * Types for route state sharing
 */

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface PaymentLocationState {
  orderItems: OrderItem[];
}
