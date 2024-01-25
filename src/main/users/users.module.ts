import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '..';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [
    UsersService,
    TypeOrmModule.forFeature([User]),
  ]
})
export class UsersModule {}
