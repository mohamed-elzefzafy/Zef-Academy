import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/category/entities/category.chema';
import { User } from 'src/users/entities/user.chema';

export type UserDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop({ type: String, required: true, minlength: 3 })
  title: string;

  @Prop({ type: String, required: true, minlength: 20 })
  description: string;

  @Prop({
    type: { url: String, public_id: String },
    _id: false,
    required: false,
  })
  thumbnail: { url: string; public_id: string };

  @Prop({ type: Number, default: 0 })
  sold: number;

  @Prop({ type: Number, min: 0 })
  price: number;

  @Prop({ type: Number, min: 0, default: 0 })
  discount: number;

  @Prop({ type: Number, min: 0 })
  finalPrice: number;

  @Prop({ type: Boolean, default: false })
  isPublished: boolean;

  @Prop({ type: Boolean, default: false })
  isFree: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: Category.name,
  })
  category: string;

  @Prop({ type: Number, min: 0, max: 5 })
  rating: number;

  @Prop({ type: Number, default: 0 })
  reviewsNumber: number;

  @Prop({ type: String, default: '00:00' })
  videosLength: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  instructor: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: User.name,
    default: [],
  })
  users: string[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
