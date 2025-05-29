import { OrderStatus } from './order-status.enum';

export class Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: OrderStatus;
  address: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}
