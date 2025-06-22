import { forwardRef, Module } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { LectureController } from './lecture.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lecture, LectureSchema } from './entities/lecture.schema';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lecture.name, schema: LectureSchema }]),
    JwtModule,
    CloudinaryModule,
    forwardRef(()=> CourseModule),
  ],
  controllers: [LectureController],
  providers: [LectureService],
  exports :[LectureService],
})
export class LectureModule {}
