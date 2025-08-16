import { Module } from '@nestjs/common';
import { WishListService } from './wish-list.service';
import { WishListController } from './wish-list.controller';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/entities/user.chema';
import { CourseModule } from 'src/course/course.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [WishListController],
  providers: [WishListService],
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CourseModule,
  ],
})
export class WishListModule {}
