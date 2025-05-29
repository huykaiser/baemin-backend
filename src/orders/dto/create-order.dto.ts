
export class OrderItemDto {
  foodId: number;
  quantity: number;
}

export class CreateOrderDto {
  items: OrderItemDto[];
  address: string;
  phone: string;
}