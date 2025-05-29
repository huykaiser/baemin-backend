import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaMysqlService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order-status.enum';

@Injectable()
export class OrdersService {
    constructor(public prismaMysql: PrismaMysqlService) {}

    async create(userId: number, createOrderDto: CreateOrderDto) {
    const { items, address, phone } = createOrderDto;

    // Check food availability and calculate total
    let totalAmount = 0;
    const foodItems = await this.prismaMysql.foods.findMany({
      where: {
        food_id: { in: items.map((item) => item.foodId) },
      },
    });

    if (foodItems.length !== items.length) {
      throw new NotFoundException('Some food items not found');
    }

    // Validate stock and calculate total
    for (const item of items) {
      const food = foodItems.find((f) => Number(f.food_id) === item.foodId);
      if (!food) continue;

      if (food.stock < item.quantity) {
        throw new BadRequestException(
          `Not enough stock for ${food.name}`,
        );
      }

      totalAmount += Number(food.price) * item.quantity;
    }

    // Start transaction
    return this.prismaMysql.$transaction(async (prisma) => {
      // Create order
      // Find the restaurant_id for the first food item
      const firstFood = items[0]?.foodId ? foodItems.find(f => Number(f.food_id) === items[0].foodId) : null;
      if (!firstFood) {
        throw new BadRequestException('Cannot determine restaurant for this order');
      }

      const order = await prisma.orders.create({
        data: {
          user_id: userId,
          restaurant_id: firstFood.restaurant_id,
          total_amount: totalAmount,
          status: OrderStatus.PENDING,
          delivery_address: address,
          contact_phone: phone,
        //   orderItems: {
        //     create: items.map((item) => {
        //       const food = foodItems.find((f) => Number(f.id) === item.foodId);
        //       if (!food) {
        //         throw new NotFoundException(`Food with id ${item.foodId} not found`);
        //       }
        //       return {
        //         foodId: item.foodId,
        //         quantity: item.quantity,
        //         price: food.price,
        //       };
        //     }),
        //   },
        },
      });
      // Update stock
      for (const item of items) {
        await prisma.foods.update({
          where: { food_id: item.foodId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // In a real app, here you would integrate with a delivery service API
      // For now, we'll just update the status to PROCESSING
      await prisma.orders.update({
        where: { order_id: order.order_id },
        data: { status: OrderStatus.PREPARING },
      });

      return order;
    });
  }

  async findAll(userId: number) {
    return this.prismaMysql.orders.findMany({
      where: { user_id: userId },
    });
  }

  async findOne(userId: number, id: number) {
    return this.prismaMysql.orders.findFirst({
      where: { order_id: id, user_id: userId },
    });
  }
}
