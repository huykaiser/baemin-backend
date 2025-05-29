import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaClient } from '@prisma/client';
import { ApiBody, ApiParam, ApiProperty, ApiQuery } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiQuery({name: "name", description: "Enter user's name", type: String})
  @ApiQuery({name: "age", description: "Enter user's name", type: Number})
  @Get('demo-query')
  getDemoQuery(
    @Query("name") user_name,
    @Query("age") user_age
  ) {
    return {user_name, user_age}
  }

  @ApiParam({name: "product_id", type: Number})
  @ApiParam({name: "order_id", type: Number})
  @Get("demo-param/:product_id/:order_id")
  getDemo(
    @Param("product_id") product_id,
    @Param("order_id") order_id
  ) {
    // request: 2 loại - params, body (json)

    /* Các loại params (parameters): 
    1. query param (query string). VD: localhost:8080/demo?name=abd&age=18
    2. route param. VD: localhost:8080/demo/products/1 (:id)
    */

    // const { name, age } = req.query

    // const { product_id, order_id } = req.params

    return { product_id, order_id }
  } 

  // @Get("foods")
  // getFoods() {
  //   const prisma = new PrismaClient();
  //   const foods = prisma.foods.findMany();

  //   return foods;
  // }

}
