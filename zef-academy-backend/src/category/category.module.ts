import { forwardRef, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './entities/category.chema';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [
    JwtModule,
    CloudinaryModule,
    MongooseModule.forFeature([{name:Category.name , schema :CategorySchema}]),
   forwardRef(()=> CourseModule),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
