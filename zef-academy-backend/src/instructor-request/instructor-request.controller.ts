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
  Res,
} from '@nestjs/common';
import { InstructorRequestService } from './instructor-request.service';
import { CreateAdminResultStatuDto } from './dto/createAdminResultStatu.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorator/Roles.decorator';
import { UserRoles } from 'src/shared/enums/roles.enum';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtPayloadType } from 'src/shared/types';
import { PAGE_LIMIT_ADMIN } from 'src/shared/constants';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Response } from 'express';

@Controller('v1/instructor-request')
export class InstructorRequestController {
  constructor(
    private readonly instructorRequestService: InstructorRequestService,
  ) {}

  @Post()
  @Roles([UserRoles.USER])
  @UseGuards(AuthGuard)
  create(@CurrentUser() user: JwtPayloadType) {
    return this.instructorRequestService.create(user);
  }

  @Get()
  @Roles([UserRoles.ADMIN])
  @UseGuards(AuthGuard)
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = `${PAGE_LIMIT_ADMIN}`,
    @Query('category') category?: string,
    @Query('user') user?: string,
  ) {
    return this.instructorRequestService.findAll(+page, +limit, category, user);
  }

  @Patch('adminUpdateResultStatu/:id')
  @Roles([UserRoles.ADMIN])
  @UseGuards(AuthGuard)
  adminUpdateResultStatu(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() createAdminResultStatuDto: CreateAdminResultStatuDto,
  ) {
    return this.instructorRequestService.adminUpdateResultStatu(id, createAdminResultStatuDto);
  }

  @Delete('accessResultStatu/:id')
  @Roles([UserRoles.USER, UserRoles.INSTRUCTOR ,UserRoles.ADMIN])
  @UseGuards(AuthGuard)
  accessResultStatu(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: JwtPayloadType,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.instructorRequestService.accessResultStatu(id, user, res);
  }

    @Delete('adminDeleteRequest/:id')
  @Roles([UserRoles.ADMIN])
  @UseGuards(AuthGuard)
  adminDeleteRequest(
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.instructorRequestService.adminDeleteRequest(id);
  }


  @Get('instructor-request/:id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.instructorRequestService.findOne(id);
  }

    @Get('currentUser-instructor-request')
  @Roles([UserRoles.USER])
  @UseGuards(AuthGuard)
  findCurrentUserInstructorRequest(@CurrentUser() user: JwtPayloadType) {
    return this.instructorRequestService.findCurrentUserInstructorRequest(user);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   // @Body() updateInstructorRequestDto: UpdateInstructorRequestDto,
  // ) {
  //   return this.instructorRequestService.update(
  //     +id,
  //     updateInstructorRequestDto,
  //   );
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instructorRequestService.remove(+id);
  }
}
