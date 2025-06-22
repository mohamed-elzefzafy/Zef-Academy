import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtPayloadType } from 'src/shared/types';
import { CourseService } from 'src/course/course.service';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './entities/review.schema';
import { Model } from 'mongoose';

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

  findAll() {
    return `This action returns all reviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
