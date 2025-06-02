import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/entities/user.chema';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    CloudinaryModule,
    JwtModule,
    MongooseModule.forFeature([{name : User.name,schema :UserSchema}]),

  ],
})
export class AuthModule {}
