import { IsEnum, IsNotEmpty } from 'class-validator';
import { RequestStatue } from 'src/shared/enums/instructorRequest.enums';

export class CreateAdminResultStatuDto {
  @IsNotEmpty()
  @IsEnum(RequestStatue, { message: 'statu must be a valid enum value' })
  requestStatueTitle: RequestStatue;
}
