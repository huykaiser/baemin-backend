import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { PrismaMysqlService } from 'src/prisma/prisma.service';
import { PaginationDto } from './dto/pagination.dto';
import { SearchFoodDto } from './dto/search-food.dto';

@Injectable()
export class FoodsService {
  constructor(public prismaMysql: PrismaMysqlService) {}

  create(createFoodDto: CreateFoodDto) {
    return 'This action adds a new food';
  }

  async findAllMysql(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [foods, total] = await Promise.all([
      this.prismaMysql.foods.findMany({
        skip,
        take: limit,
      }),
      this.prismaMysql.foods.count(),
    ]);

    return {
      data: foods,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findByCategory(categoryId: number) {
    console.log('findByCategory with categoryId', categoryId);
    return this.prismaMysql.foods.findMany({
      where: { category_id : categoryId },
    });
  }

  async search(searchFoodDto: SearchFoodDto) {
    const { query } = searchFoodDto;
    return this.prismaMysql.foods.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
      },
    });
  }

  async findOne(id: number) {
    return this.prismaMysql.foods.findUnique({
      where: { food_id : id },
    });
  }

  update(id: number, updateFoodDto: UpdateFoodDto) {
    return `This action updates a #${id} food`;
  }

  remove(id: number) {
    return `This action removes a #${id} food`;
  }
}
