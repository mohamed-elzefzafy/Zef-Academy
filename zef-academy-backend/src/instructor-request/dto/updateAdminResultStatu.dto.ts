import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminResultStatuDto } from './createAdminResultStatu.dto';

export class UpdteAdminResultStatuDto extends PartialType(
  CreateAdminResultStatuDto,
) {}
