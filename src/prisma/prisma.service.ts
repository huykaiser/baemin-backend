import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient as PrismaPostgresClient } from '.prisma/client-postgres';
import { PrismaClient as PrismaMysqlClient } from '.prisma/client-mysql';

@Injectable()
export class PrismaPostgresService extends PrismaPostgresClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }
}

@Injectable()
export class PrismaMysqlService extends PrismaMysqlClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }
}

