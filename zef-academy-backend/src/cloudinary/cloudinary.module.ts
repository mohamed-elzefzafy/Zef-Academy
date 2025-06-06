import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';
import * as cloudinary from 'cloudinary';
import { CloudinaryVideoService } from './cloudinary-video.service';
import { CloudinaryPDFService } from './cloudinary-pdf.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'CLOUDINARY',
      useFactory: (configService: ConfigService) => {
        // Configure Cloudinary with environment variables
        return cloudinary.v2.config({
          cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
          api_key: configService.get<string>('CLOUDINARY_API_KEY'),
          api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
          secure: true,
        });
      },
      inject: [ConfigService],
    },
    CloudinaryService,
    CloudinaryVideoService,
    CloudinaryPDFService
  ],
  exports: [CloudinaryService , CloudinaryVideoService, CloudinaryPDFService],
})
export class CloudinaryModule {}
