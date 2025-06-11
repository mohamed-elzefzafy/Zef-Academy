import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/category/entities/category.chema';

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

  @Prop({ type: Number, min: 0 })
  price_after_discount: number;

  @Prop({ type: Boolean, default: false })
  isPublished: boolean;

    @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: Category.name,
  })
  category: string;

  // Category	Object ID  Ref: “Categories”
  // Lecture	Object ID  Ref: “Lecture”
  // teacher	Object ID  Ref: “User”
  // Ratings Average	Number, default: 0
  // Ratings Quantity	Number, default: 0
  // attachment  Attachment[]
  // purchases   Purchase[]
}

export const CourseSchema = SchemaFactory.createForClass(Course);




