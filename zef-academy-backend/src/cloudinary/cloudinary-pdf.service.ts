import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinaryV2 } from 'cloudinary';

@Injectable()
export class CloudinaryPDFService {
  constructor() {
    cloudinaryV2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // Upload PDF to Cloudinary
  async uploadPDF(file: Express.Multer.File, folder: string): Promise<any> {
    try {
      return new Promise<any>((resolve, reject) => {
        // Set up the upload stream with Cloudinary options for PDFs
        const uploadStream = cloudinaryV2.uploader.upload_stream(
          { resource_type: 'raw', folder: `Zef-Academy/${folder}`, format: 'pdf' },
          (error, result) => {
            if (error) {
              console.error('Error uploading PDF to Cloudinary:', error);
              reject(new InternalServerErrorException('Cloudinary PDF upload failed'));
            }
            resolve(result);
          },
        );

        // Push the file buffer into the stream
        uploadStream.end(file.buffer);
      });
    } catch (error) {
      console.error('Internal server error during Cloudinary PDF upload:', error);
      throw new InternalServerErrorException(
        'Internal server error during Cloudinary PDF upload',
      );
    }
  }

  // Remove PDF from Cloudinary
  async removePDF(pdfPublicId: string): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        cloudinaryV2.uploader.destroy(
          pdfPublicId,
          { resource_type: 'raw' },
          (error, result) => {
            if (error) {
              console.error('Error removing PDF from Cloudinary:', error);
              reject(new InternalServerErrorException('Cloudinary PDF removal failed'));
            } else {
              resolve(result);
            }
          },
        );
      });
    } catch (error) {
      console.error('Internal server error during Cloudinary PDF removal:', error);
      throw new InternalServerErrorException(
        'Internal server error during Cloudinary PDF removal',
      );
    }
  }

  // Remove multiple PDFs from Cloudinary
  async removeMultiplePDFs(publicIds: string[]): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        cloudinaryV2.api.delete_resources(
          publicIds,
          { resource_type: 'raw' },
          (error, result) => {
            if (error) {
              console.error('Error removing multiple PDFs from Cloudinary:', error);
              reject(
                new InternalServerErrorException(
                  'Cloudinary multiple PDF removal failed',
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
        'Internal server error during Cloudinary multiple PDF removal:',
        error,
      );
      throw new InternalServerErrorException(
        'Internal server error during Cloudinary multiple PDF removal',
      );
    }
  }
}