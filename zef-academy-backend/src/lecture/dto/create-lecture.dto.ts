import { IsNotEmpty, IsString } from "class-validator";

export class CreateLectureDto {
  @IsNotEmpty()
  @IsString()
    title: string;
}