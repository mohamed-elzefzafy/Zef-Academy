import {
  BadGatewayException,
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Lecture } from './entities/lecture.schema';
import { Model } from 'mongoose';
import { CloudinaryVideoService } from 'src/cloudinary/cloudinary-video.service';
import { CloudinaryPDFService } from 'src/cloudinary/cloudinary-pdf.service';
import { CourseService } from 'src/course/course.service';
import { JwtPayloadType } from 'src/shared/types';
import { UserRoles } from 'src/shared/enums/roles.enum';
import {
  FreeStatus,
  ToggleLectureToFreeOrNotDto,
} from './dto/toggleLectureToFreeOrNot.dto';

@Injectable()
export class LectureService {
  constructor(
    @InjectModel(Lecture.name) private readonly lectureModel: Model<Lecture>,
    private readonly cloudinaryVideoService: CloudinaryVideoService,
    private readonly cloudinaryPDFService: CloudinaryPDFService,
    @Inject(forwardRef(() => CourseService))
    private readonly courseService: CourseService,
  ) {}
  // async create(
  //   createLectureDto: CreateLectureDto,
  //   file: Express.Multer.File,
  //   user: JwtPayloadType,
  // ) {
  //   const course = await this.courseService.findOneWithoutpopulate(
  //     createLectureDto.course,
  //   );
  //   if (!course.isPublished) {
  //     throw new BadRequestException(
  //       'the course must be published first besfor upload lectures',
  //     );
  //   }
  //   if (course.instructor.toString() !== user.id.toString()) {
  //     throw new UnauthorizedException(
  //       'you are not allowed to access this route',
  //     );
  //   }

  //   const lecture = await this.lectureModel.findOne({
  //     title: createLectureDto.title,
  //     course: createLectureDto.course,
  //   });
  //   if (lecture) {
  //     throw new BadRequestException('lecture with this name already exist');
  //   }

  //   if (!file) {
  //     throw new BadRequestException('video is required');
  //   }

  //   const result = await this.cloudinaryVideoService.uploadVideo(
  //     file,
  //     'lectures',
  //   );
  //   const videoUrl = {
  //     url: result.secure_url,
  //     public_id: result.public_id,
  //   };

  //   const newLecture = await this.lectureModel.create({
  //     ...createLectureDto,
  //     videoUrl,
  //     user: user.id,
  //     isFree: course.isFree ? true : false,
  //   });

  //   //TODO:set position property for this lecture and all course lectures
  //   return newLecture;
  // }

  async create(
    createLectureDto: CreateLectureDto,
    file: Express.Multer.File,
    user: JwtPayloadType,
  ) {
    const course = await this.courseService.findOneWithoutpopulate(
      createLectureDto.course,
    );

    if (!course.isPublished) {
      throw new BadRequestException(
        'The course must be published before uploading lectures',
      );
    }

    if (course.instructor.toString() !== user.id.toString()) {
      throw new UnauthorizedException(
        'You are not allowed to access this route',
      );
    }

    const existingLecture = await this.lectureModel.findOne({
      title: createLectureDto.title,
      course: createLectureDto.course,
    });

    if (existingLecture) {
      throw new BadRequestException('Lecture with this title already exists');
    }

    if (!file) {
      throw new BadRequestException('Video is required');
    }

    const result = await this.cloudinaryVideoService.uploadVideo(
      file,
      'lectures',
    );

    const videoUrl = {
      url: result.secure_url,
      public_id: result.public_id,
      originalDuration: +result.duration,
      videoDuration: this.getLectureVideoDuration(+result.duration),
    };
    // Fetch existing lectures for the course
    const lectures = await this.lectureModel
      .find({ course: createLectureDto.course })
      .sort({ position: 1 });

    let newPosition: number;

    if (
      createLectureDto.position !== undefined &&
      createLectureDto.position !== null &&
      createLectureDto.position >= 0
    ) {
      newPosition = createLectureDto.position;

      // Shift all existing lectures at or after this position
      await this.lectureModel.updateMany(
        {
          course: createLectureDto.course,
          position: { $gte: newPosition },
        },
        { $inc: { position: 1 } },
      );
    } else {
      // Append to end
      const lastLecture = lectures[lectures.length - 1];
      newPosition = lastLecture ? lastLecture.position + 1 : 0;
    }

    const newLecture = await this.lectureModel.create({
      ...createLectureDto,
      videoUrl,
      user: user.id,
      isFree: course.isFree || newPosition === 0 ? true : false,
      position: newPosition,
    });

    // let courseVideosLength = 0;
    // for (let i = 0; i < lectures.length; i++) {
    //   console.log(lectures);
      
    //   courseVideosLength += lectures[i].videoUrl.originalDuration;
    //   console.log("length",lectures[i].videoUrl.originalDuration);
      
    // }
    // console.log("courseVideosLength",courseVideosLength);
    
    // course.videosLength += newLecture.videoUrl.originalDuration;
    // await course.save();

    return newLecture;
  }

  public async findAllCourseLectures(
    page: number,
    limit: number,
    courseId: string,
    user: JwtPayloadType,
  ) {
    const course = await this.courseService.findOneWithoutpopulate(courseId);
    if (user.role === UserRoles.USER && !course.isFree) {
      if (!course.users.includes(user.id.toString())) {
        throw new UnauthorizedException(
          'you are not allowed to access this route',
        );
      }
    }
    if (user.role === UserRoles.INSTRUCTOR) {
      if (course.instructor.toString() !== user.id.toString()) {
        throw new UnauthorizedException(
          'you are not allowed to access this route',
        );
      }
    }
    // Ensure page and limit are positive integers
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, limit);

    // Calculate skip (offset) for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch users and total count using Mongoose
    const lectures = await this.lectureModel
      .find({ course: courseId })
      .sort({ position : "asc" }) 
      .skip(skip)
      .limit(limitNumber)
      .exec();

    const total = await this.lectureModel
      .countDocuments({ course: courseId })
      .exec();

    const pagesCount = Math.ceil(total / limitNumber);

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

  async findOne(id: string, user: JwtPayloadType) {
    let lecture = await this.lectureModel.findById(id).populate('course');
    if (!lecture) {
      throw new NotFoundException(`lecture with id ${id} not found`);
    }
    const course = await this.courseService.findOneWithoutpopulate(
      lecture.course,
    );
    if (!course.isFree || !lecture.isFree) {
      if (
        course.instructor.toString() === user.id.toString() ||
        course.users.includes(user.id.toString()) ||
        user.role === UserRoles.ADMIN
      ) {
        return lecture;
      } else {
        throw new UnauthorizedException(
          'you are not allowed to access this route',
        );
      }
    }

    
    return lecture;
  }

  async update(
    id: string,
    updateLectureDto: UpdateLectureDto,
    file: Express.Multer.File,
    user: JwtPayloadType,
  ) {
    const lecture = await this.findOne(id, user);

    if (!lecture) {
      throw new NotFoundException(`lecture with id ${id} not found`);
    }

    updateLectureDto.course = lecture.course;

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
        originalDuration: +result.duration,
        videoDuration: this.getLectureVideoDuration(+result.duration),
      };
    }

    Object.assign(lecture, updateLectureDto);

    if (lecture.position === 0) {
      lecture.isFree === true;
    }

    await lecture.save();

    // const lectures = await this.lectureModel
    //   .find({ course: updateLectureDto.course })
    //   .sort({ position: 1 });
    // const course = await this.courseService.findOneWithoutpopulate(
    //   updateLectureDto.course,
    // );

    // let courseVideosLength = 0;
    // for (let id = 0; id < lectures.length; id++) {
    //   courseVideosLength += lectures[id].videoUrl.originalDuration;
    // }
    // course.videosLength = courseVideosLength;
    // await course.save();

    return lecture;
  }

  async toggleLectureToFreeOrNot(
    id: string,
    toggleLectureToFreeOrNotDto: ToggleLectureToFreeOrNotDto,
    user: JwtPayloadType,
  ) {
    let lecture = await this.lectureModel.findById(id).populate('course');
    if (!lecture) {
      throw new NotFoundException(`lecture with id ${id} not found`);
    }

    if (lecture.position === 0) {
      lecture.isFree = true;
      return {
        message:
          'the lecture is free because it is the first lecture of the course',
      };
    }
    const course = await this.courseService.findOneWithoutpopulate(
      lecture.course,
    );
    if (
      course.instructor.toString() !== user.id.toString() &&
      user.role !== UserRoles.ADMIN
    ) {
      throw new UnauthorizedException(
        'you are not allowed to access this route',
      );
    }
    if (course.isFree) {
      return { message: 'the course is free so all lectures must be free' };
    }

    if (toggleLectureToFreeOrNotDto.requestStatueTitle === FreeStatus.FREE) {
      lecture.isFree = true;
    } else {
      lecture.isFree = false;
    }
    await lecture.save();
    return lecture;
  }

  async updateLecturePosition(
    id: string,
    newPosition: number,
    user: JwtPayloadType,
  ) {
    const lecture = await this.findOne(id, user);
    if (!lecture) {
      throw new NotFoundException(`Lecture with id ${id} not found`);
    }
    const course = await this.courseService.findOneWithoutpopulate(
      lecture.course,
    );
    if (course.instructor.toString() !== user.id.toString()) {
      throw new UnauthorizedException(
        'you are not allowed to access this route',
      );
    }

    const courseId = lecture.course;

    // Step 1: Get all lectures of the course ordered by position
    const lectures = await this.lectureModel
      .find({ course: courseId })
      .sort({ position: 1 });

    // Step 2: Remove the current lecture from the list
    const remainingLectures = lectures.filter((l) => l._id.toString() !== id);

    // Clamp newPosition between 0 and remainingLectures.length
    const clampedPosition = Math.max(
      0,
      Math.min(newPosition, remainingLectures.length),
    );

    // Step 3: Insert the lecture at the new position
    remainingLectures.splice(clampedPosition, 0, lecture);

    // Step 4: Reassign all positions
    for (let i = 0; i < remainingLectures.length; i++) {
      if (remainingLectures[i].position !== i) {
        remainingLectures[i].position = i;
        await remainingLectures[i].save();
      }
    }

    for (let i = 0; i < lectures.length; i++) {
      if (lectures[i].position === 0) {
        lectures[i].isFree === true;
      }
    }

    return { message: `Lecture moved to position ${clampedPosition}` };
  }

  async remove(id: string, user: JwtPayloadType) {
    const lecture = await this.findOne(id, user);
    if (!lecture) {
      throw new NotFoundException(`lecture with id ${id} not found`);
    }

    // ✅ 1. Delete video from Cloudinary if exists
    if (lecture.videoUrl?.public_id) {
      try {
        const removeResult = await this.cloudinaryVideoService.removeVideo(
          lecture.videoUrl.public_id,
        );
        if (removeResult.result !== 'ok') {
          console.warn(`Failed to delete video: ${removeResult.result}`);
        }
      } catch (error) {
        console.error(`Error deleting video: ${error.message}`);
      }
    }

    // ✅ 2. Delete attachments if any
    if (lecture.attachments.length > 0) {
      const publicIds: string[] = lecture.attachments.map(
        (pdf) => pdf.public_id,
      );
      await this.cloudinaryPDFService.removeMultiplePDFs(publicIds);
    }

    // ✅ 3. Delete the lecture
    await lecture.deleteOne();

    // ✅ 4. Reorder remaining lectures in the same course
    const lectures = await this.lectureModel
      .find({ course: lecture.course })
      .sort({ position: 1 });

    for (let i = 0; i < lectures.length; i++) {
      // Only update if the position has changed
      if (lectures[i].position !== i) {
        lectures[i].position = i;
        await lectures[i].save();
      }
    }

    for (let i = 0; i < lectures.length; i++) {
      if (lectures[i].position === 0) {
        lectures[i].isFree === true;
      }


    //       const lectures = await this.lectureModel
    //   .find({ course: updateLectureDto.course })
    //   .sort({ position: 1 });
    // const course = await this.courseService.findOneWithoutpopulate(
    //   lecture.course,
    // );

    // let courseVideosLength = 0;
    // for (let id = 0; id < lectures.length; id++) {
    //   courseVideosLength += lectures[id].videoUrl.originalDuration;
    // }
    // course.videosLength = courseVideosLength;
    // await course.save();

    }
    return {
      message: `Lecture with id (${id}) was removed and positions updated.`,
    };
  }

  async addAttachments(
    id: string,
    files: Express.Multer.File[],
    user: JwtPayloadType,
  ) {
    const lecture = await this.findOne(id, user);

    if (!lecture) {
      throw new NotFoundException(`lecture with id ${id} not found`);
    }
    if (!files) {
      throw new NotFoundException(`no attachments provided`);
    }

    const attachmentsLength = files.length + lecture.attachments.length;
    if (attachmentsLength > 5) {
      throw new BadRequestException("attachments can't be more than 5");
    }
    if (!files) {
      throw new BadRequestException('attachments is required');
    }
    let uploadedAttachment: {
      url: string;
      public_id: string;
      originalName: string;
    }[] = [];

    for (let i = 0; i < files.length; i++) {
      const result = await this.cloudinaryPDFService.uploadPDF(
        files[i],
        'lectures/attachments',
      );

      uploadedAttachment.push({
        url: result.secure_url,
        public_id: result.public_id,
        originalName: files[i].originalname,
      });
    }
    lecture.attachments.push(...uploadedAttachment);
    return lecture.save();
  }

  async removeAttachment(id: string, publicId: string, user: JwtPayloadType) {
    const lecture = await this.findOne(id, user);

    if (!lecture) {
      throw new NotFoundException(`lecture with id ${id} not found`);
    }

    let uploadedAttachment: {
      url: string;
      public_id: string;
      originalName: string;
    }[] = lecture.attachments;

    //  const publicIds = uploadedAttachment.map(pdf => pdf.public_id);
    //  console.log(publicIds);

    for (let i = 0; i < uploadedAttachment.length; i++) {
      await this.cloudinaryPDFService.removePDF(publicId);

      uploadedAttachment = uploadedAttachment.filter(
        (pdf) => pdf.public_id !== publicId,
      );
    }
    lecture.attachments = uploadedAttachment;
    return lecture.save();
  }

  async deleteLecturesForCourse(courseId: string) {
    const lectures = await this.lectureModel.find({ course: courseId });
    console.log('lectures', lectures);

    const publicIds = lectures.map((lecture) => lecture.videoUrl.public_id);
    if (publicIds.length > 0) {
      await this.cloudinaryVideoService.removeMultipleVideos(publicIds);
      console.log('publicIds', publicIds);
    }

    for (let i = 0; i < lectures.length; i++) {
      let publicAttachmentIds = lectures[i].attachments.map(
        (attachment) => attachment.public_id,
      );
      if (publicAttachmentIds.length > 0) {
        await this.cloudinaryPDFService.removeMultiplePDFs(publicAttachmentIds);
        console.log('publicAttachmentIds', publicAttachmentIds);
      }
    }
    await this.lectureModel.deleteMany({ course: courseId });
    return { message: 'hi shella' };
  }

  async getCourseLectures(courseId: string) {
    const lectures = await this.lectureModel.find({ course: courseId });
    return lectures;
  }

  // private getLectureVideoDuration(duration: number): string {
  //   if (!duration) {
  //     return '0:00';
  //   }
  //   const minutes = Math.floor(duration / 60);
  //   const seconds = Math.floor(duration % 60);
  //   return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  // }

   getLectureVideoDuration(duration: number): string {
  if (!duration) {
    return '0:00';
  }

  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);

  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = seconds.toString().padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  } else {
    return `${minutes}:${paddedSeconds}`;
  }
}
}
