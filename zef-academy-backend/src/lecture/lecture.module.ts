import { Module } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { LectureController } from './lecture.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lecture, LectureSchema } from './entities/lecture.schema';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lecture.name, schema: LectureSchema }]),
    JwtModule,
    CloudinaryModule,
  ],
  controllers: [LectureController],
  providers: [LectureService],
})
export class LectureModule {}
