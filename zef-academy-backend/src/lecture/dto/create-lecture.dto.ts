import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLectureDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId({ message: 'course must be a valid MongoDB ObjectId' })
  course: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  position: number | null;
}
