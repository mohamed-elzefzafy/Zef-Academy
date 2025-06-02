import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRoles } from 'src/shared/enums/roles.enum';

export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    minlength: [3, 'Title must be at least 3 characters'],
  })
  title: string;

  @Prop({
    type: { url: String, public_id: String },
    _id: false,
    required: false,
  })
  image: { url: string; public_id: string };

  @Prop({
    type: { url: String, public_id: String },
    _id: false,
    required: false,
  })
  video: { url: string; public_id: string };

  @Prop({
    type: { url: String, public_id: String },
    _id: false,
    required: false,
  })
  pdf: { url: string; public_id: string };

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Boolean, default: false })
  isAccountVerified: boolean;

  @Prop({ type: String, default: null })
  verificationCode: string;

  @Prop({
    type: { url: String, public_id: String },
    _id: false,
    required: false,
    default:
      '\'{"url": "https://res.cloudinary.com/dw1bs1boz/image/upload/v1702487318/Zef-Blog/Default%20images/download_w26sr9.jpg", "public_id": null}\'',
  })
  profileImage: { url: string; public_id: string };

  @Prop({ type: UserRoles, default: UserRoles.USER })
  role: UserRoles;
}

export const UserSchema = SchemaFactory.createForClass(User);
