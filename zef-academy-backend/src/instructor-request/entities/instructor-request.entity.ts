import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { RequestStatue } from 'src/shared/enums/instructorRequest.enums';
import { User } from 'src/users/entities/user.chema';

export type UserDocument = HydratedDocument<InstructorRequest>;
@Schema({ timestamps: true })
export class InstructorRequest {
  @Prop({ type: String, RequestStatue})
  requestStatueTitle: RequestStatue;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  user: string;
}

export const InstructorRequestSchema =
  SchemaFactory.createForClass(InstructorRequest);
