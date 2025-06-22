import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Course } from 'src/course/entities/course.chema';
import { User } from 'src/users/entities/user.chema';

export type UserDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: String, required: true, minlength: 3 })
  comment: string;

  @Prop({ type: Number, min: 0 })
  rating: number;

    @Prop({
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User.name,
    })
    user: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: Course.name,
  })
  course: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);