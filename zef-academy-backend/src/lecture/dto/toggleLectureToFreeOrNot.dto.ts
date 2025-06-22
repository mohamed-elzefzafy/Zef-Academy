import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum FreeStatus  {
  FREE = "free",
  NOTFREE = "notFree"
}
export class ToggleLectureToFreeOrNotDto {
  @IsNotEmpty()
  @IsEnum(FreeStatus, { message: 'statu must be a valid enum value' })
  requestStatueTitle: FreeStatus;
}
