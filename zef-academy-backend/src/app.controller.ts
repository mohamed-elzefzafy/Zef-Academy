import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CourseService } from './course/course.service';
import { LectureService } from './lecture/lecture.service';
import { UsersService } from './users/users.service';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Roles } from './auth/decorator/Roles.decorator';
import { AuthGuard } from './auth/guards/auth.guard';
import { UserRoles } from './shared/enums/roles.enum';
import { CategoryService } from './category/category.service';
import { InstructorRequestService } from './instructor-request/instructor-request.service';
import { ReviewsService } from './reviews/reviews.service';

@Controller('v1/app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly courseService: CourseService,
    private readonly lectureService: LectureService,
    private readonly categoryService: CategoryService,
    private readonly usersService: UsersService,
    private readonly instructorRequestService: InstructorRequestService,
    private readonly reviewsService: ReviewsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('get-instructor-counts/:instructorId')
  @Roles([UserRoles.INSTRUCTOR])
  @UseGuards(AuthGuard)
  async getInstructorCounts(
    @Param('instructorId', ParseObjectIdPipe) instructorId: string,
  ) {
    await this.usersService.findOne(instructorId);
    const coursesCount = await this.courseService.getCoursesCount(instructorId);
    const lecturesCount =
      await this.lectureService.getLectureCount(instructorId);
    // const usersCount = await this.usersService.getUsersCount();
    // const commentsCount = await this.commentService.getCommentsCount();
    // return { postsCount, categoriesCount, usersCount, commentsCount };

    return { coursesCount, lecturesCount };
  }


    @Get('get-admin-counts')
  @Roles([UserRoles.ADMIN])
  @UseGuards(AuthGuard)
  async getAdminCounts(
    // @Param('adminId', ParseObjectIdPipe) adminId: string,
  ) {
    // await this.usersService.findOne(adminId);
    const coursesCount = await this.courseService.getAdminCoursesCount();
    const usersCount = await this.usersService.getUsersCount();
    const categoriesCount = await this.categoryService.getCategoriesCount();
    const instructorRequestsCount = await this.instructorRequestService.getAdminInstructorRequestCount();
    const reviewsCount = await this.reviewsService.getAdminReviewCount();
    // const commentsCount = await this.commentService.getCommentsCount();
    // return { postsCount, categoriesCount, usersCount, commentsCount };

    return { coursesCount, usersCount , categoriesCount , instructorRequestsCount , reviewsCount};
  }
}
