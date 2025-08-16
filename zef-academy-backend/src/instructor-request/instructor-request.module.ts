import { Module } from '@nestjs/common';
import { InstructorRequestService } from './instructor-request.service';
import { InstructorRequestController } from './instructor-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InstructorRequest,
  InstructorRequestSchema,
} from './entities/instructor-request.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InstructorRequest.name, schema: InstructorRequestSchema },
    ]),
    JwtModule,
    UsersModule,
  ],
  controllers: [InstructorRequestController],
  providers: [InstructorRequestService],
  exports:[InstructorRequestService]
})
export class InstructorRequestModule {}
