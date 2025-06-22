import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCourseDiscountDto {
  @IsNumber()
  @Min(0)
  @Type(()=>Number)
  discount: number;
}
