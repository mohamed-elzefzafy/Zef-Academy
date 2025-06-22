import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateLectureDto } from './create-lecture.dto';

export class UpdateLectureDto extends PartialType(
  OmitType(CreateLectureDto, ['position'] as const),
) {}