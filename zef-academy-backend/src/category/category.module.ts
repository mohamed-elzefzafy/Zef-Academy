import { forwardRef, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './entities/category.chema';

@Module({
  imports: [
    JwtModule,
    CloudinaryModule,
    MongooseModule.forFeature([{name:Category.name , schema :CategorySchema}])
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
