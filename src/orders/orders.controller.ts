import { Controller, Post, Get, Body, Req, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Req() req: Request & { user?: any }, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user.userId, createOrderDto);
  }

  @Get()
  findAll(@Req() req: Request & { user?: any }) {
    return this.ordersService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req: Request & { user?: any }, @Param('id') id: string) {
    return this.ordersService.findOne(req.user.userId, +id);
  }

}
