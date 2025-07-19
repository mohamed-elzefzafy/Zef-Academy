import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './entities/course.chema';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CategoryService } from 'src/category/category.service';
import { JwtPayloadType } from 'src/shared/types';
import { LectureService } from 'src/lecture/lecture.service';
import { UserRoles } from 'src/shared/enums/roles.enum';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    private readonly cloudinaryService: CloudinaryService,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => LectureService))
    private readonly lectureService: LectureService,
  ) {}
  async create(
    createCourseDto: CreateCourseDto,
    file: Express.Multer.File,
    user: JwtPayloadType,
  ) {
    const course = await this.courseModel.findOne({
      title: createCourseDto.title,
    });
    if (course) {
      throw new BadRequestException(
        `Course with title ${createCourseDto.title} already exists`,
      );
    }

    if (createCourseDto.price - createCourseDto.discount < 10) {
      throw new BadRequestException(
        'the price after discount must be more than 10',
      );
    }

    await this.categoryService.findOne(createCourseDto.category);
    if (!file) {
      throw new BadRequestException('Thumbnail is required');
    }

    const result = await this.cloudinaryService.uploadImage(file, 'courses');
    const thumbnail = {
      url: result.secure_url,
      public_id: result.public_id,
    };
    createCourseDto.discount = createCourseDto.discount || 0;
    const newCourse = this.courseModel.create({
      ...createCourseDto,
      thumbnail,
      instructor: user.id,
      priceAfterDiscount: +createCourseDto.price - +createCourseDto.discount,
    });
    return newCourse;
  }

  // public async findAll(page: number, limit: number, category?: string , user? :string) {
  //   // Ensure page and limit are positive integers
  //   const pageNumber = Math.max(1, page);
  //   const limitNumber = Math.max(1, limit);

  //   // Calculate skip (offset) for pagination
  //   const skip = (pageNumber - 1) * limitNumber;

  //   // Build query object
  //   const query = this.courseModel.find();

  //   // Apply category filter if provided
  //   if (category) {
  //     query.where('category').equals(category);
  //   }
  //   if (user) {
  //     query.where('user').equals(user);
  //   }

  //   // Fetch courses with sorting and pagination
  //   const courses = await query
  //     .sort({ role: 1, createdAt: 1 }) // ASC sorting
  //     .skip(skip)
  //     .limit(limitNumber)
  //     .exec();

  //   // Count total documents (with filter if applied)
  //   const total = await this.courseModel
  //     .countDocuments(category ? { category } : category && user ?{category , user} :user?{user}: {})
  //     .exec();

  //   // Calculate total pages
  //   const pagesCount = Math.ceil(total / limitNumber);

  //   // Return paginated result
  //   return {
  //     courses,
  //     pagination: {
  //       total,
  //       page: pageNumber,
  //       limit: limitNumber,
  //       pagesCount,
  //     },
  //   };
  // }

  public async findAll(
    page: number,
    limit: number,
    category?: string,
    user?: string,
    search?: string, // ✅ add this
  ) {
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter object
    const filter: any = {};

    if (category) filter.category = category;
    if (user) filter.instructor = user;
    filter.isPublished = true; 

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Build query
    const query = this.courseModel
      .find(filter)
      .populate('category')
      .populate('instructor');

    const courses = await query
      .sort({ createdAt: -1 }) // or your custom sorting
      .skip(skip)
      .limit(limitNumber)
      .exec();

    const total = await this.courseModel.countDocuments(filter).exec();

    const pagesCount = Math.ceil(total / limitNumber);

    return {
      courses,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pagesCount,
      },
    };
  }

  async findOne(id: string) {
    let course = await this.courseModel
      .findById(id)
      .populate('category')
      .populate('instructor')
      .populate('users');
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    const lectures = await this.lectureService.getCourseLectures(id);

        let courseVideosLength = 0;
    for (let id = 0; id < lectures.length; id++) {
      courseVideosLength += lectures[id].videoUrl.originalDuration;
    }


    course.videosLength = this.lectureService.getLectureVideoDuration(courseVideosLength);
    await course.save();

    return course;
  }

  async findOneWithoutpopulate(id: string) {
    let course = await this.courseModel.findById(id);
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    return course;
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    file: Express.Multer.File,
  ) {
    const course = await this.findOne(id);

    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    if (file) {
      if (course.thumbnail?.public_id) {
        console.log(
          'Attempting to delete public_id:',
          course.thumbnail.public_id,
        );
        try {
          const removeResult = await this.cloudinaryService.removeImage(
            course.thumbnail.public_id,
          );
          if (removeResult.result !== 'ok') {
            console.warn(
              `Failed to delete image with public_id ${course.thumbnail.public_id}: ${removeResult.result}`,
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
      const result = await this.cloudinaryService.uploadImage(file, 'courses');
      console.log('Upload result:', result);

      course.thumbnail = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    Object.assign(course, updateCourseDto);
    course.priceAfterDiscount = course.price - course.discount;
    // Save to database
    return await course.save();
  }
  async remove(id: string, user: JwtPayloadType) {
    const course = await this.findOneWithoutpopulate(id);
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    if (
      course.instructor.toString() !== user.id.toString() &&
      user.role !== UserRoles.ADMIN
    ) {
      throw new UnauthorizedException(
        'you are not allowed to access this route',
      );
    }

    if (course.thumbnail?.public_id) {
      console.log(
        'Attempting to delete public_id:',
        course.thumbnail.public_id,
      );
      try {
        const removeResult = await this.cloudinaryService.removeImage(
          course.thumbnail.public_id,
        );
        if (removeResult.result !== 'ok') {
          console.warn(
            `Failed to delete image with public_id ${course.thumbnail.public_id}: ${removeResult.result}`,
          );
        }
      } catch (error) {
        console.error(`Error deleting image: ${error.message}`);
        // Continue with upload, but log the error
      }
    } else {
      console.warn('No public_id found for the current thumbnail');
    }
    await this.lectureService.deleteLecturesForCourse(course._id.toString());
    await course?.deleteOne();
    return { message: `Course with id (${id}) has removed` };
  }

  async updateCourseToPublish(id: string) {
    const course = await this.findOne(id);
    if (course.isPublished) {
      throw new NotFoundException(`The course is publish already`);
    }
    course.isPublished = true;
    await course.save();
    return course;
  }

  async toggleCourseToFreeOrNot(id: string, user: JwtPayloadType) {
    const course = await this.findOne(id);

    if (course.instructor.toString() !== user.id.toString()) {
      throw new UnauthorizedException(
        'you are not allowed to access this route',
      );
    }

    const lectures = await this.lectureService.getCourseLectures(id);

    if (course.isFree) {
      course.isFree = false;
      for (let i = 0; i < lectures.length; i++) {
        if (lectures[i].isFree) {
          lectures[i].isFree = false;
          await lectures[i].save();
        }
      }
    } else {
      course.isFree = true;
      for (let i = 0; i < lectures.length; i++) {
        if (!lectures[i].isFree) {
          lectures[i].isFree = true;
          await lectures[i].save();
        }
      }
    }
    await course.save();
    return course;
  }

  async createCourseDiscount(
    id: string,
    user: JwtPayloadType,
    courseDiscount: number,
  ) {
    const course = await this.findOneWithoutpopulate(id);

    if (course.instructor.toString() !== user.id.toString()) {
      throw new UnauthorizedException(
        'you are not allowed to access this route',
      );
    }
    if (courseDiscount === 0) {
      throw new BadRequestException(
        'the price after discount must be more than 10',
      );
    }

    if (course.price - courseDiscount < 10) {
      throw new BadRequestException(
        'the price after discount must be more than 10',
      );
    }
    course.discount = courseDiscount;
    course.priceAfterDiscount = +course.price - +course.discount;
    await course.save();
    return course;
  }

  async getCoursesForSpecificCategory(categoryId: string) {
    const courses = await this.courseModel.find({ category: categoryId });
    return courses;
  }

  async updateCheckOut(courseId: string, userId: string) {
    const course = await this.findOneWithoutpopulate(courseId);


// let subscriberUsers = course.users || [];
// subscriberUsers.push(userId);

//     subscriberUsers = [...new Set(subscriberUsers)]; // Remove duplicates
      
//     course.users = subscriberUsers;
if (course.users.find(id => id.toString() === userId.toString()))  {
      throw new BadRequestException(
        'the user is already subscribed to the course',
      );
} else {
    course.users.push(userId);
    course.sold += 1;
}
    

    await course.save();
    return course;
  }

// async updateCheckOut(courseId: string, userId: string) {
//   const course = await this.findOneWithoutpopulate(courseId);

//   // const userObjectId = new Types.ObjectId(userId); 
//   // if (course.users.includes(userObjectId.toString())) {
//   //   return { message: `you already subscribed to ${course.title} course` };
//   // }
// const userObjectId = new Types.ObjectId(userId);

// if (course.users.find((u) => u.toString() === userObjectId.toString())) {
//   return { message: `you already subscribed to ${course.title} course` };
// }

//   const updatedCourse = await this.courseModel.findByIdAndUpdate(
//     courseId,
//     {
//       $addToSet: { users: userId },
//       $inc: { sold: 1 }
//     },
//     { new: true }
//   );

//   if (!updatedCourse) {
//     throw new NotFoundException('Course not found');
//   }

//   return updatedCourse;
// }


// async updateCheckOut(courseId: string, userId: string) {
//     try {
//       // Validate courseId and userId
//       if (!Types.ObjectId.isValid(courseId) || !Types.ObjectId.isValid(userId)) {
//         throw new NotFoundException('Invalid courseId or userId');
//       }

//       // Atomically update the course: add userId to users array and increment sold
//       const course = await this.courseModel.findOneAndUpdate(
//         { _id: courseId, users: { $ne: userId } }, // Only update if userId is not in users
//         {
//           $addToSet: { users: userId }, // Add userId if not already present
//           $inc: { sold: 1 }, // Increment sold count
//         },
//         { new: true } // Return the updated document
//       );

//       if (!course) {
//         throw new NotFoundException('Course not found or user already subscribed');
//       }

//       console.log(`Updated course users for courseId: ${courseId}, users: ${course.users}`);
//       return course;
//     } catch (error) {
//       console.error(`Error in updateCheckOut for courseId: ${courseId}, userId: ${userId}`, error);
//       throw error;
//     }
//   }
}
