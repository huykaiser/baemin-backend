import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { FoodsModule } from './foods/foods.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({
    isGlobal: true}), UsersModule, AuthModule, JwtModule.register({global: true}), FoodsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
