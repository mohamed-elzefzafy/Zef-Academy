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
import { isValidObjectId, Model, Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CategoryService } from 'src/category/category.service';
import { JwtPayloadType } from 'src/shared/types';
import { LectureService } from 'src/lecture/lecture.service';
import { UserRoles } from 'src/shared/enums/roles.enum';
import { UpdateCourseToNotFreeDto } from './dto/updateCourseToNotFree.dto';

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

    if (createCourseDto.isFree) {
      if (course) {
        throw new BadRequestException(
          `Course with title ${createCourseDto.title} already exists`,
        );
      }

      createCourseDto.price = 0;
      createCourseDto.discount = 0;

      await this.categoryService.findOne(createCourseDto.category);
      if (!file) {
        throw new BadRequestException('Thumbnail is required');
      }

      const result = await this.cloudinaryService.uploadImage(file, 'courses');
      const thumbnail = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      const newCourse = await this.courseModel.create({
        ...createCourseDto,
        thumbnail,
        instructor: user.id,
        finalPrice: 0,
        isFree: true,
      });

      await newCourse.save();
      return newCourse;
    } else {
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
      const newCourse = await this.courseModel.create({
        ...createCourseDto,
        thumbnail,
        instructor: user.id,
        isFree: false,
        finalPrice: +createCourseDto.price - +createCourseDto.discount,
      });
      if (newCourse.finalPrice === 0) {
        newCourse.isFree = true;
      }

      await newCourse.save();
      return newCourse;
    }
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
    if (user && isValidObjectId(user)) filter.instructor = user;
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

  public async findAllInstructorCourses(
    page: number,
    limit: number,
    user?: string,
  ) {
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter object
    const filter: any = {};

    if (user) filter.instructor = user;

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

    public async findAllAdminCourses(
    page: number,
    limit: number,
  ) {
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter object
    const filter: any = {};


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

async findUserCourses(userId: string, page: number, limit: number) {
  const pageNumber = Math.max(1, page);
  const limitNumber = Math.max(1, limit);
  const skip = (pageNumber - 1) * limitNumber;

  // إجمالي عدد الكورسات
  const total = await this.courseModel.countDocuments({ users: userId });

  // الكورسات مع pagination
  const courses = await this.courseModel
    .find({ users: userId })
    .populate('instructor', 'name email')
    .populate('category', 'title')
    .skip(skip)
    .limit(limitNumber);

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


  async findCoursesByInstructor(instructorId: string) {
  return this.courseModel
    .find({ instructor: instructorId })
    .select('_id name')
    .lean();
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

    course.videosLength =
      this.lectureService.getLectureVideoDuration(courseVideosLength);
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
    course.finalPrice = course.price - course.discount;
    // Save to database
    if (course.finalPrice === 0) {
      course.isFree = true;
    }

    await course.save();
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

  async updateCourseToNotFree(
    id: string,
    user: JwtPayloadType,
    updateCourseToNotFreeDto: UpdateCourseToNotFreeDto,
  ) {
    const course = await this.findOneWithoutpopulate(id);
    if (
      updateCourseToNotFreeDto.price - updateCourseToNotFreeDto.discount <
      10
    ) {
      throw new BadRequestException(
        'the price after discount must be more than 10',
      );
    }
    if (course.instructor.toString() !== user.id.toString()) {
      throw new UnauthorizedException(
        'you are not allowed to access this route',
      );
    }

    if (!course.isFree) {
      throw new UnauthorizedException('the course is not free already');
    }

    const lectures = await this.lectureService.getCourseLectures(id);

    course.isFree = false;
    course.price = updateCourseToNotFreeDto.price;
    course.discount = updateCourseToNotFreeDto.discount || 0;
    course.finalPrice = +course.price - +course.discount;
    for (let i = 0; i < lectures.length; i++) {
      if (lectures[i].isFree) {
        lectures[i].isFree = false;
        await lectures[i].save();
      }
    }
    const firstLecture = lectures[0];
    firstLecture.isFree = true;
    await firstLecture.save();
    //  else {
    //   course.isFree = true;
    //   for (let i = 0; i < lectures.length; i++) {
    //     if (!lectures[i].isFree) {
    //       lectures[i].isFree = true;
    //       await lectures[i].save();
    //     }
    //   }
    //   course.price = 0;
    //   course.discount = 0;
    //   course.finalPrice = 0;
    // }
    await course.save();
    return course;
  }

  async updateCourseToFree(id: string, user: JwtPayloadType) {
    const course = await this.findOneWithoutpopulate(id);

    if (course.instructor.toString() !== user.id.toString()) {
      throw new UnauthorizedException(
        'you are not allowed to access this route',
      );
    }

    const lectures = await this.lectureService.getCourseLectures(id);

    if (course.isFree) {
      throw new UnauthorizedException('the course is free already');
    }

    course.isFree = true;
    for (let i = 0; i < lectures.length; i++) {
      if (!lectures[i].isFree) {
        lectures[i].isFree = true;
        await lectures[i].save();
      }
    }
    course.price = 0;
    course.discount = 0;
    course.finalPrice = 0;

    // if (course.isFree) {
    //   course.isFree = false;
    //   if (course.finalPrice === 0) {
    //     th
    //   }
    //   for (let i = 0; i < lectures.length; i++) {
    //     if (lectures[i].isFree) {
    //       lectures[i].isFree = false;
    //       await lectures[i].save();
    //     }
    //   }
    // } else {
    //   course.isFree = true;
    //   for (let i = 0; i < lectures.length; i++) {
    //     if (!lectures[i].isFree) {
    //       lectures[i].isFree = true;
    //       await lectures[i].save();
    //     }
    //   }
    //   course.price = 0;
    //   course.discount = 0;
    //   course.finalPrice = 0;
    // }
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
    if (courseDiscount === 0 && course.discount === 0) {
      throw new BadRequestException(
        'the discount already exists with value 0',
      );
    }

    if (course.price - courseDiscount < 10) {
      throw new BadRequestException(
        'the price after discount must be more than 10',
      );
    }
    course.discount = courseDiscount;
    course.finalPrice = +course.price - +course.discount;
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
    if (course.users.find((id) => id.toString() === userId.toString())) {
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

  getCoursesInstructor(instructorId: string) {
    return this.courseModel.find({ instructor: instructorId });
  }

//   async findUserCourses(userId: string) {
//   const courses = await this.courseModel
//     .find({ users: userId }) // هنا بيدور لو الـ userId موجود جوه الـ array
//     .populate('instructor', 'name email') // ممكن تجيب بيانات الانستركتور
//     .populate('category', 'title'); // وممكن تجيب بيانات الكاتيجوري

//   return courses;
// }

  getCoursesCount(instructorId: string) {
    return this.courseModel.countDocuments({ instructor: instructorId });
  }

    getAdminCoursesCount() {
    return this.courseModel.countDocuments();
  }
}
