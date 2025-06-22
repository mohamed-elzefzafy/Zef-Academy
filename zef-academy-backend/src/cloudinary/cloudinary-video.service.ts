import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinaryV2 } from 'cloudinary';

@Injectable()
export class CloudinaryVideoService {
  constructor() {
    cloudinaryV2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // Upload video to Cloudinary
  async uploadVideo(file: Express.Multer.File, folder: string): Promise<any> {
    try {
      return new Promise<any>((resolve, reject) => {
        // Set up the upload stream with Cloudinary options for video
        const uploadStream = cloudinaryV2.uploader.upload_stream(
          {
            resource_type: 'video',
            // type: 'authenticated',
            // sign_url: true,
            // secure: true,
            folder: `Zef-Academy/${folder}`,
          },
          (error, result) => {
            if (error) {
              console.error('Error uploading video to Cloudinary:', error);
              reject(
                new InternalServerErrorException(
                  'Cloudinary video upload failed',
                ),
              );
            }
            resolve(result);
          },
        );

        // Push the file buffer into the stream
        uploadStream.end(file.buffer);
      });
    } catch (error) {
      console.error(
        'Internal server error during Cloudinary video upload:',
        error,
      );
      throw new InternalServerErrorException(
        'Internal server error during Cloudinary video upload',
      );
    }
  }

  // Remove video from Cloudinary
  async removeVideo(videoPublicId: string): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        cloudinaryV2.uploader.destroy(
          videoPublicId,
          { resource_type: 'video' },
          (error, result) => {
            if (error) {
              console.error('Error removing video from Cloudinary:', error);
              reject(
                new InternalServerErrorException(
                  'Cloudinary video removal failed',
                ),
              );
            } else {
              resolve(result);
            }
          },
        );
      });
    } catch (error) {
      console.error(
        'Internal server error during Cloudinary video removal:',
        error,
      );
      throw new InternalServerErrorException(
        'Internal server error during Cloudinary video removal',
      );
    }
  }

  // Remove multiple videos from Cloudinary
  async removeMultipleVideos(publicIds: string[]): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        cloudinaryV2.api.delete_resources(
          publicIds,
          { resource_type: 'video' },
          (error, result) => {
            if (error) {
              console.error(
                'Error removing multiple videos from Cloudinary:',
                error,
              );
              reject(
                new InternalServerErrorException(
                  'Cloudinary multiple video removal failed',
                ),
              );
            } else {
              resolve(result);
            }
          },
        );
      });
    } catch (error) {
      console.error(
        'Internal server error during Cloudinary multiple video removal:',
        error,
      );
      throw new InternalServerErrorException(
        'Internal server error during Cloudinary multiple video removal',
      );
    }
  }
}
