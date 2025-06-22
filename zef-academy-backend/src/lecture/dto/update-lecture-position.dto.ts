import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLecturePositionDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  position: number;
}
