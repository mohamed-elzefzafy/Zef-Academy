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

@Controller('v1/lecture')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Post()
  @Roles([UserRoles.ADMIN])
  @UseInterceptors(FileInterceptor('videoUrl'))
  create(
    @Body() createLectureDto: CreateLectureDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.lectureService.create(createLectureDto, file);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = `${PAGE_LIMIT_ADMIN}`,
  ) {
    return this.lectureService.findAll(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.lectureService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('videoUrl'))
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateLectureDto: UpdateLectureDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.lectureService.update(id, updateLectureDto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.lectureService.remove(id);
  }

  @Patch('attachments/:id')
  @UseInterceptors(FilesInterceptor('attachments', 5, multerOptions))
  addAttachments(
    @Param('id', ParseObjectIdPipe) id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.lectureService.addAttachments(id, files);
  }

  @Delete('attachments/:id')
  removeAttachment(
    @Param('id', ParseObjectIdPipe) id: string,
    @Query('publicId') publicId: string,
  ) {
    return this.lectureService.removeAttachment(id , publicId);
  }
}
