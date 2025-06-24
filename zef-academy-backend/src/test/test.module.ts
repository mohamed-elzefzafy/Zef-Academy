import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestSchema } from './entities/TestSchema';

@Module({
  controllers: [TestController],
  providers: [TestService],
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
  ],
})
export class TestModule {}
