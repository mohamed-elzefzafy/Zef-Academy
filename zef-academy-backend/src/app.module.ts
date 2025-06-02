/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './test/test.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TestModule,
        ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CloudinaryModule,
    MulterModule.register({
      storage: multer.memoryStorage(), // Store files in memory
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          transport: {
            service: 'gmail',
            auth: {
              user: config.get<string>('EMAIL_USERNAME'),
              pass: config.get<string>('EMAIL_PASSWORD'),
            },
          },
        };
      },
    }),
    MongooseModule.forRootAsync({
      inject :[ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_URL'),
        dbName : 'Zef-Academy'
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


