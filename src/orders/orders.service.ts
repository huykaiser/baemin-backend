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
        id: { in: items.map((item) => item.foodId) },
      },
    });

    if (foodItems.length !== items.length) {
      throw new NotFoundException('Some food items not found');
    }

    // Validate stock and calculate total
    for (const item of items) {
      const food = foodItems.find((f) => Number(f.id) === item.foodId);
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
      const order = await prisma.orders.create({
        data: {
          userId,
          totalAmount,
          status: OrderStatus.PENDING,
          address,
          phone,
          orderItems: {
            create: items.map((item) => {
              const food = foodItems.find((f) => Number(f.id) === item.foodId);
              if (!food) {
                throw new NotFoundException(`Food with id ${item.foodId} not found`);
              }
              return {
                foodId: item.foodId,
                quantity: item.quantity,
                price: food.price,
              };
            }),
          },
        },
        include: {
          orderItems: {
            include: {
              foods: true,
            },
          },
        },
      });

      // Update stock
      for (const item of items) {
        await prisma.foods.update({
          where: { id: item.foodId },
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
        where: { id: order.id },
        data: { status: OrderStatus.PROCESSING },
      });

      return order;
    });
  }

  async findAll(userId: number) {
    return this.prismaMysql.orders.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            foods: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: number, id: number) {
    return this.prismaMysql.orders.findFirst({
      where: { id, userId },
      include: {
        orderItems: {
          include: {
            foods: true,
          },
        },
      },
    });
  }
}
