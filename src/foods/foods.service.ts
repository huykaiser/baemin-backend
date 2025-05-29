import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { PrismaMysqlService, PrismaPostgresService } from 'src/prisma/prisma.service';

@Injectable()
export class FoodsService {
  constructor(public prismaPostgres: PrismaPostgresService, public prismaMysql: PrismaMysqlService) {}

  create(createFoodDto: CreateFoodDto) {
    return 'This action adds a new food';
  }

  findAll() {
    return this.prismaPostgres.products.findMany({
      take: 10,
    });
  }

  findAllMysql() {
    return this.prismaMysql.products.findMany({
      take: 10,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} food`;
  }

  update(id: number, updateFoodDto: UpdateFoodDto) {
    return `This action updates a #${id} food`;
  }

  remove(id: number) {
    return `This action removes a #${id} food`;
  }
}
