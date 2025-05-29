import { Injectable } from '@nestjs/common';
import { PrismaMysqlService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
    constructor(public prismaMysql: PrismaMysqlService) {}

    async findAll() {
        return this.prismaMysql.foodCategories.findMany();
    }

    findOne(id: number) {
        return this.prismaMysql.foodCategories.findUnique({
        where: { category_id : id },
        include: { foods: true },
    });
  }
}
