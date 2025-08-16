import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discount: number;

  @IsNotEmpty()
  @IsMongoId({ message: 'Category must be a valid MongoDB ObjectId' })
  category: string;

  @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isFree: boolean;
}
