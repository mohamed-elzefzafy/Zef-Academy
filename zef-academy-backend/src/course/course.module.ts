import { forwardRef, Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './entities/course.chema';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CategoryModule } from 'src/category/category.module';
import { LectureModule } from 'src/lecture/lecture.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    JwtModule,
    CloudinaryModule,
  forwardRef(()=>  LectureModule),
  forwardRef(()=>  CategoryModule),
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports : [CourseService],
})
export class CourseModule {}
