import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Lecture } from './entities/lecture.schema';
import { Model } from 'mongoose';
import { CloudinaryVideoService } from 'src/cloudinary/cloudinary-video.service';
import { CloudinaryPDFService } from 'src/cloudinary/cloudinary-pdf.service';

@Injectable()
export class LectureService {
  constructor(
    @InjectModel(Lecture.name) private readonly lectureModel: Model<Lecture>,
    private readonly cloudinaryVideoService: CloudinaryVideoService,
    private readonly cloudinaryPDFService: CloudinaryPDFService,
  ) {}
  async create(createLectureDto: CreateLectureDto, file: Express.Multer.File) {
    const lecture = await this.lectureModel.findOne({
      title: createLectureDto.title,
    });

    if (!file) {
      throw new BadRequestException('video is required');
    }

    const result = await this.cloudinaryVideoService.uploadVideo(
      file,
      'lectures',
    );
    const videoUrl = {
      url: result.secure_url,
      public_id: result.public_id,
    };
    const newLecture = await this.lectureModel.create({
      ...createLectureDto,
      videoUrl,
    });

    //TODO:set position property for this lecture and all course lectures
    return newLecture;
  }

  public async findAll(page: number, limit: number) {
    // Ensure page and limit are positive integers
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, limit);

    // Calculate skip (offset) for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch users and total count using Mongoose
    const lectures = await this.lectureModel
      .find()
      .sort({ role: 1, createdAt: 1 }) // ASC sorting
      .skip(skip)
      .limit(limitNumber)
      .exec();

    const total = await this.lectureModel.countDocuments().exec();

    // Calculate total pages
    const pagesCount = Math.ceil(total / limitNumber);

    // Return paginated result
    return {
      lectures,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pagesCount,
      },
    };
  }

  async findOne(id: string) {
    let lecture = await this.lectureModel.findById(id);
    if (!lecture) {
      throw new NotFoundException(`lecture with id ${id} not found`);
    }
    return lecture;
  }

  async update(
    id: string,
    updateLectureDto: UpdateLectureDto,
    file: Express.Multer.File,
  ) {
    const lecture = await this.findOne(id);

    if (!lecture) {
      throw new NotFoundException(`lecture with id ${id} not found`);
    }

    if (file) {
      if (lecture.videoUrl.public_id) {
        console.log(
          'Attempting to delete public_id:',
          lecture.videoUrl.public_id,
        );
        try {
          const removeResult = await this.cloudinaryVideoService.removeVideo(
            lecture.videoUrl.public_id,
          );
          if (removeResult.result !== 'ok') {
            console.warn(
              `Failed to delete video with public_id ${lecture.videoUrl.public_id}: ${removeResult.result}`,
            );
          }
        } catch (error) {
          console.error(`Error deleting image: ${error.message}`);
          // Continue with upload, but log the error
        }
      } else {
        console.warn('No public_id found for the current thumbnail');
      }

      // Upload new image
      const result = await this.cloudinaryVideoService.uploadVideo(
        file,
        'lectures',
      );
      console.log('Upload result:', result);

      lecture.videoUrl = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    Object.assign(lecture, updateLectureDto);

    return await lecture.save();
  }

  async remove(id: string) {
    const lecture = await this.findOne(id);
    if (!lecture) {
      throw new NotFoundException(`lecture with id ${id} not found`);
    }

    if (lecture.videoUrl.public_id) {
      console.log(
        'Attempting to delete public_id:',
        lecture.videoUrl.public_id,
      );
      try {
        const removeResult = await this.cloudinaryVideoService.removeVideo(
          lecture.videoUrl.public_id,
        );
        if (removeResult.result !== 'ok') {
          console.warn(
            `Failed to delete video with public_id ${lecture.videoUrl.public_id}: ${removeResult.result}`,
          );
        }
      } catch (error) {
        console.error(`Error deleting video: ${error.message}`);
        // Continue with upload, but log the error
      }
    } else {
      console.warn('No public_id found for the current videoUrl');
    }
    if (lecture.attachments.length > 0) {
 const publicIds : string[] = lecture.attachments.map(pdf => pdf.public_id);
    await this.cloudinaryPDFService.removeMultiplePDFs(publicIds);
    }
    await lecture?.deleteOne();
    return { message: `lecture with id (${id}) was removed` };
  }

  async addAttachments(id: string, files: Express.Multer.File[]) {
    const lecture = await this.findOne(id);

    if (!lecture) {
      throw new NotFoundException(`lecture with id ${id} not found`);
    }

    const attachmentsLength = files.length + lecture.attachments.length;
    if (attachmentsLength > 5) {
      throw new BadRequestException("attachments can't be more than 5")
    }
    if (!files) {
      throw new BadRequestException('attachments is required');
    }
    let uploadedAttachment: { url: string; public_id: string }[] = [];
  
    for (let i = 0; i < files.length; i++) {
        const result = await this.cloudinaryPDFService.uploadPDF(
        files[i],
        'lectures/attachments',
      );
      uploadedAttachment.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
      
    }
    lecture.attachments.push(...uploadedAttachment) 
    return lecture.save();
  }

  
 async  removeAttachment(id: string , publicId : string) {
      const lecture = await this.findOne(id);

    if (!lecture) {
      throw new NotFoundException(`lecture with id ${id} not found`);
    }

    let uploadedAttachment : { url: string; public_id: string }[] = lecture.attachments;

  //  const publicIds = uploadedAttachment.map(pdf => pdf.public_id);
  //  console.log(publicIds);
   

    for (let i = 0; i < uploadedAttachment.length; i++) {
    await this.cloudinaryPDFService.removePDF(publicId);

  uploadedAttachment =  uploadedAttachment.filter(pdf => pdf.public_id !== publicId);  
    }
    lecture.attachments = uploadedAttachment
return lecture.save();
  }
}
