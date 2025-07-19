import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtPayloadType } from 'src/shared/types';
import { CourseService } from 'src/course/course.service';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './entities/review.schema';
import { Model } from 'mongoose';
import { Course } from 'src/course/entities/course.chema';
import { UserRoles } from 'src/shared/enums/roles.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    private readonly courseService: CourseService,
  ) {}
  async create(createReviewDto: CreateReviewDto, user: JwtPayloadType) {
    const course = await this.courseService.findOneWithoutpopulate(
      createReviewDto.course,
    );
    if (course.instructor.toString() === user.id.toString()) {
      throw new BadRequestException("you can't review your course");
    }

    if (!course.isPublished) {
      throw new BadRequestException('subscribe the course not Published');
    }

    if (!course.users.includes(user.id)) {
      throw new BadRequestException('subscribe the course first');
    }
    const userReview = await this.reviewModel.findOne({
      course: course._id,
      user: user.id,
    });
    if (userReview) {
      throw new BadRequestException('you have already reviewed this course');
    }
    const review = await this.reviewModel.create({
      ...createReviewDto,
      user: user.id,
    });

    course.reviewsNumber += 1;
    const courseReviews = await this.reviewModel.find({ course: course._id });
    let courseRating = 0;

    for (let i = 0; i < courseReviews.length; i++) {
      courseRating += courseReviews[i].rating;
    }
    course.rating = courseRating / courseReviews.length;
    course.reviewsNumber = courseReviews.length;
    await course.save();
    return review;
  }

  async findAll(courseId: string) {
   await this.courseService.findOneWithoutpopulate(courseId);
    const courseReviews = await this.reviewModel.find({ course: courseId }).populate("user");
    return courseReviews;
  }

  async findAllAdmin() {
    const courseReviews = await this.reviewModel.find();
    return courseReviews;
  }

  async findOne(id: string) {
    const review = await this.reviewModel.findById(id);
    if (!review) {
      throw new NotFoundException(`ther's no review with this id : ${id}`);
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, user: JwtPayloadType) {
  const review = await this.reviewModel.findById(id);

  if (!review) {
      throw new NotFoundException(`ther's no review with this id : ${id}`);
    }
if (review.user.toString() !== user.id.toString()) {
  throw new UnauthorizedException("you are not allowed to access this route");
}
  Object.assign(review , updateReviewDto);
  await review.save();
  return review;

  }

  async remove(id: string, user: JwtPayloadType) {
    const review = await this.reviewModel.findById(id);

  if (!review) {
      throw new NotFoundException(`ther's no review with this id : ${id}`);
    }
if (review.user.toString() !== user.id.toString()) {
  throw new UnauthorizedException("you are not allowed to access this route");
}
await review.deleteOne();

  return { message: `Review with id (${id}) has removed` };
  }

    async removeAdminAndInstructor(id: string, user: JwtPayloadType) {
    const review = await this.reviewModel.findById(id);

  if (!review) {
      throw new NotFoundException(`ther's no review with this id : ${id}`);
    }

        const course = await this.courseService.findOneWithoutpopulate(
      review.course,
    );
if (course.instructor.toString() !== user.id.toString() && user.role !== UserRoles.ADMIN) {
  throw new UnauthorizedException("you are not allowed to access this route");
}
await review.deleteOne();

  return { message: `Review with id (${id}) has removed` };
  }
}
