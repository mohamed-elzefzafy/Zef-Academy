import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './entities/course.chema';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly categoryService: CategoryService,
  ) {}
  async create(createCourseDto: CreateCourseDto, file: Express.Multer.File) {
    const course = await this.courseModel.findOne({
      title: createCourseDto.title,
    });
    if (course) {
      throw new BadRequestException(
        `Course with title ${createCourseDto.title} already exists`,
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
    const newCourse = this.courseModel.create({
      ...createCourseDto,
      thumbnail,
    });
    return newCourse;
  }

 public async findAll(page: number, limit: number, category?: string) {
    // Ensure page and limit are positive integers
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, limit);

    // Calculate skip (offset) for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Build query object
    const query = this.courseModel.find();
    
    // Apply category filter if provided
    if (category) {
      query.where('category').equals(category);
    }

    // Fetch courses with sorting and pagination
    const courses = await query
      .sort({ role: 1, createdAt: 1 }) // ASC sorting
      .skip(skip)
      .limit(limitNumber)
      .exec();

    // Count total documents (with filter if applied)
    const total = await this.courseModel.countDocuments(
      category ? { category } : {}
    ).exec();

    // Calculate total pages
    const pagesCount = Math.ceil(total / limitNumber);

    // Return paginated result
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

 async  findOne(id: string) {
    let course = await this.courseModel.findById(id).populate("category");
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    return course;
  }

  // async update(
  //   id: string,
  //   updateCourseDto: UpdateCourseDto,
  //   file: Express.Multer.File,
  // ) {
  //   const course = await this.findOne(id);
    
  //   if (!course) {
  //     throw new NotFoundException(`Course with id ${id} not found`);
  //   }
    
  //   if (file) {
  //     console.log(course.thumbnail.public_id);
      
  // const result555 = await  this.cloudinaryService.removeImage(course.thumbnail.public_id);
  //    console.log('Remove result:', result555);

  //     const result = await this.cloudinaryService.uploadImage(file, 'courses');
  //     console.log(result);
      
  //   course.thumbnail = {
  //       url: result.secure_url,
  //       public_id: result.public_id,
  //     };
  //   }
  // Object.assign(course , updateCourseDto);
  // return course;

  // }

//   async update(id: string, updateCourseDto: UpdateCourseDto, file: Express.Multer.File) {
//   const course = await this.findOne(id);

//   if (!course) {
//     throw new NotFoundException(`Course with id ${id} not found`);
//   }

//   if (file) {
//     // Attempt to delete old thumbnail if it exists
//     if (course.thumbnail?.public_id) {
//       console.log('Attempting to delete public_id:', course.thumbnail.public_id);
//       try {
//         const removeResult = await this.cloudinaryService.removeImage(course.thumbnail.public_id);
//         console.log('Remove result:', removeResult);
//         if (removeResult.result !== 'ok') {
//           console.warn(`Failed to delete image with public_id ${course.thumbnail.public_id}: ${removeResult.result}`);
//         }
//       } catch (error) {
//         console.error(`Error deleting image: ${error.message}`);
//         // Continue with upload, but log the error
//       }
//     } else {
//       console.warn('No public_id found for the current thumbnail');
//     }

//     // Upload new image
//     const result = await this.cloudinaryService.uploadImage(file, 'courses');
//     console.log('Upload result:', result);

//     course.thumbnail = {
//       url: result.secure_url,
//       public_id: result.public_id,
//     };
//   }

//   Object.assign(course, updateCourseDto);

//   // Save to database
//   return await course.save();
// }


async update(id: string, updateCourseDto: UpdateCourseDto, file: Express.Multer.File) {
  const course = await this.findOne(id);

  if (!course) {
    throw new NotFoundException(`Course with id ${id} not found`);
  }

  if (file) {
    if (course.thumbnail?.public_id) {
      console.log('Attempting to delete public_id:', course.thumbnail.public_id);
      try {
        const removeResult = await this.cloudinaryService.removeImage(course.thumbnail.public_id);
        if (removeResult.result !== 'ok') {
          console.warn(`Failed to delete image with public_id ${course.thumbnail.public_id}: ${removeResult.result}`);
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

  // Save to database
  return await course.save();
}
 async  remove(id: string) {
    const course = await this.findOne(id);
  if (!course) {
    throw new NotFoundException(`Course with id ${id} not found`);
  }


      if (course.thumbnail?.public_id) {
      console.log('Attempting to delete public_id:', course.thumbnail.public_id);
      try {
        const removeResult = await this.cloudinaryService.removeImage(course.thumbnail.public_id);
        if (removeResult.result !== 'ok') {
          console.warn(`Failed to delete image with public_id ${course.thumbnail.public_id}: ${removeResult.result}`);
        }
      } catch (error) {
        console.error(`Error deleting image: ${error.message}`);
        // Continue with upload, but log the error
      }
    } else {
      console.warn('No public_id found for the current thumbnail');
    }
    await course?.deleteOne();
    return { message: `Course with id (${id}) was removed` };
  }
}
