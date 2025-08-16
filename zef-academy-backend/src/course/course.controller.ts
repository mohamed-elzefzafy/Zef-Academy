import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Roles } from 'src/auth/decorator/Roles.decorator';
import { UserRoles } from 'src/shared/enums/roles.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PAGE_LIMIT_ADMIN } from 'src/shared/constants';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtPayloadType } from 'src/shared/types';
import { CreateCourseDiscountDto } from './dto/create-course-discount.dto';
import { UpdateCourseToNotFreeDto } from './dto/updateCourseToNotFree.dto';

@Controller('v1/course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Roles([UserRoles.ADMIN, UserRoles.INSTRUCTOR])
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  create(
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.courseService.create(createCourseDto, file, user);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = `${PAGE_LIMIT_ADMIN}`,
    @Query('category') category?: string,
    @Query('user') user?: string,
    @Query('search') search?: string,
  ) {
    return this.courseService.findAll(+page, +limit, category, user, search);
  }

  @Get('instructor-courses')
  @Roles([UserRoles.INSTRUCTOR])
  @UseGuards(AuthGuard)
  findAllInstructorCourses(
    @CurrentUser() user: JwtPayloadType,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = `${PAGE_LIMIT_ADMIN}`,
  ) {
    return this.courseService.findAllInstructorCourses(+page, +limit, user.id);
  }

  @Get('admin-courses')
  @Roles([UserRoles.ADMIN])
  @UseGuards(AuthGuard)
  findAllAdminCourses(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = `${PAGE_LIMIT_ADMIN}`,
  ) {
    return this.courseService.findAllAdminCourses(+page, +limit);
  }

    @Get('get-my-subscribed-courses')
  @Roles([UserRoles.INSTRUCTOR, UserRoles.USER])
  @UseGuards(AuthGuard)
  findUserCourses(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = `20`,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.courseService.findUserCourses(user.id ,+page , +limit);
  }
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.courseService.findOne(id);
  }
  @Patch(':id')
  @Roles([UserRoles.ADMIN, UserRoles.INSTRUCTOR])
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.courseService.update(id, updateCourseDto, file);
  }

  @Patch('publish-course/:id')
  @Roles([UserRoles.ADMIN])
  @UseGuards(AuthGuard)
  updateCourseToPublish(@Param('id', ParseObjectIdPipe) id: string) {
    return this.courseService.updateCourseToPublish(id);
  }

  @Patch('make-course-notFree/:id')
  @Roles([UserRoles.INSTRUCTOR])
  @UseGuards(AuthGuard)
  updateCourseToNotFree(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: JwtPayloadType,
    @Body() updateCourseToNotFreeDto: UpdateCourseToNotFreeDto,
  ) {
    return this.courseService.updateCourseToNotFree(
      id,
      user,
      updateCourseToNotFreeDto,
    );
  }

  @Patch('make-course-Free/:id')
  @Roles([UserRoles.INSTRUCTOR])
  @UseGuards(AuthGuard)
  updateCourseToFree(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.courseService.updateCourseToFree(id, user);
  }

  @Patch('create-discount/:id')
  @Roles([UserRoles.INSTRUCTOR])
  @UseGuards(AuthGuard)
  createCourseDiscount(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: JwtPayloadType,
    @Body() createCourseDiscountDto: CreateCourseDiscountDto,
  ) {
    return this.courseService.createCourseDiscount(
      id,
      user,
      createCourseDiscountDto.discount,
    );
  }

  @Delete(':id')
  @Roles([UserRoles.ADMIN, UserRoles.INSTRUCTOR])
  @UseGuards(AuthGuard)
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.courseService.remove(id, user);
  }


}
