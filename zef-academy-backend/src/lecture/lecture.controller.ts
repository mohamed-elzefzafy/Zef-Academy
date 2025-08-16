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
  UploadedFiles,
} from '@nestjs/common';
import { LectureService } from './lecture.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PAGE_LIMIT_ADMIN } from 'src/shared/constants';
import { Roles } from 'src/auth/decorator/Roles.decorator';
import { UserRoles } from 'src/shared/enums/roles.enum';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { multerOptions } from 'src/shared/multer.config';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtPayloadType } from 'src/shared/types';
import { ToggleLectureToFreeOrNotDto } from './dto/toggleLectureToFreeOrNot.dto';
import { UpdateLecturePositionDto } from './dto/update-lecture-position.dto';

@Controller('v1/lecture')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Post()
  @UseInterceptors(FileInterceptor('videoUrl'))
  @Roles([UserRoles.ADMIN, UserRoles.INSTRUCTOR])
  @UseGuards(AuthGuard)
  create(
    @Body() createLectureDto: CreateLectureDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.lectureService.create(createLectureDto, file, user);
  }

  @Get('lectures-course/:id')
  @Roles([UserRoles.ADMIN, UserRoles.INSTRUCTOR, UserRoles.USER])
  @UseGuards(AuthGuard)
  findAllCourseLectures(
    // @Query('page') page: string = '1',
    // @Query('limit') limit: string = `${PAGE_LIMIT_ADMIN}`,
    @Param('id', ParseObjectIdPipe) courseId: string,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.lectureService.findAllCourseLectures(
      // +page,
      // +limit,
      courseId,
      user,
    );
  }

  @Get('my-lectures-courses')
  @Roles([UserRoles.INSTRUCTOR])
  @UseGuards(AuthGuard)
  findAllMyLectures(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = `${PAGE_LIMIT_ADMIN}`,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.lectureService.findAllInstructorLectures(+page, +limit, user);
  }

  //   @Get('lectures-course-instructor/:id')
  // @Roles([ UserRoles.INSTRUCTOR])
  // @UseGuards(AuthGuard)
  // findAllCourseLecturesInstructor(
  //   @Query('page') page: string = '1',
  //   @Query('limit') limit: string = `${PAGE_LIMIT_ADMIN}`,
  //   @CurrentUser() user: JwtPayloadType,
  // ) {
  //   return this.lectureService.findAllCourseLecturesInstructor(
  //     +page,
  //     +limit,
  //     user,
  //   );
  // }

  @Get(':id')
  @Roles([UserRoles.ADMIN, UserRoles.INSTRUCTOR, UserRoles.USER])
  @UseGuards(AuthGuard)
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.lectureService.findOne(id, user);
  }

  // @Patch('update-lectureToFree/:id')
  // @Roles([UserRoles.ADMIN, UserRoles.INSTRUCTOR])
  // @UseGuards(AuthGuard)
  // toggleLectureToFreeOrNot(
  //   @Param('id', ParseObjectIdPipe) id: string,
  //   @Body() toggleLectureToFreeOrNotDto : ToggleLectureToFreeOrNotDto,
  //   @CurrentUser() user: JwtPayloadType,
  // ) {
  //   return this.lectureService.toggleLectureToFreeOrNot(id, toggleLectureToFreeOrNotDto, user);
  // }

  @Patch('update-position/:id')
  @Roles([UserRoles.ADMIN, UserRoles.INSTRUCTOR])
  @UseGuards(AuthGuard)
  updateLecturePosition(
    @Param('id') id: string,
    @Body() UpdateLecturePositionDto: UpdateLecturePositionDto,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.lectureService.updateLecturePosition(
      id,
      UpdateLecturePositionDto.position,
      user,
    );
  }

  @Patch(':id')
  @Roles([UserRoles.ADMIN, UserRoles.INSTRUCTOR])
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('videoUrl'))
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateLectureDto: UpdateLectureDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.lectureService.update(id, updateLectureDto, file, user);
  }

  @Delete(':id')
  @Roles([UserRoles.ADMIN, UserRoles.INSTRUCTOR])
  @UseGuards(AuthGuard)
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.lectureService.remove(id, user);
  }

  @Patch('attachments/:id')
  @Roles([UserRoles.ADMIN, UserRoles.INSTRUCTOR, UserRoles.USER])
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('attachments', 5, multerOptions))
  addAttachments(
    @Param('id', ParseObjectIdPipe) id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.lectureService.addAttachments(id, files, user);
  }

  @Delete('attachments/:id')
  @Roles([UserRoles.ADMIN, UserRoles.INSTRUCTOR, UserRoles.USER])
  @UseGuards(AuthGuard)
  removeAttachment(
    @Param('id', ParseObjectIdPipe) id: string,
    @Query('publicId') publicId: string,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.lectureService.removeAttachment(id, publicId, user);
  }

  @Delete('test-test/:id')
  deleteLecturesForCourse(@Param('id', ParseObjectIdPipe) courseId: string) {
    return this.lectureService.deleteLecturesForCourse(courseId);
  }
}
