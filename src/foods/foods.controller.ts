import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { PaginationDto } from './dto/pagination.dto';
import { SearchFoodDto } from './dto/search-food.dto';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  create(@Body() createFoodDto: CreateFoodDto) {
    return this.foodsService.create(createFoodDto);
  }

  @Get('get-all-mysql')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.foodsService.findAllMysql(paginationDto);
  }

  @Get('category/:id')
  findByCategory(@Param('id') id: string) {
    return this.foodsService.findByCategory(+id);
  }

  @Get('search')
  search(@Query() searchFoodDto: SearchFoodDto) {
    return this.foodsService.search(searchFoodDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodsService.findOne(+id);
  }
}
