import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Roles } from 'src/auth/decorator/Roles.decorator';
import { UserRoles } from 'src/shared/enums/roles.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtPayloadType } from 'src/shared/types';

@Controller('v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @Roles([UserRoles.INSTRUCTOR, UserRoles.USER])
  @UseGuards(AuthGuard)
  create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.reviewsService.create(createReviewDto, user);
  }


  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
