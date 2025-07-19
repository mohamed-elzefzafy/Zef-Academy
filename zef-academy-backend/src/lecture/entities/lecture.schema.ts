import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Course } from 'src/course/entities/course.chema';

export type UserDocument = HydratedDocument<Lecture>;

@Schema({ timestamps: true })
export class Lecture {
  @Prop({ type: String, required: true, minlength: 3 })
  title: string;

  @Prop({
    type: { url: String, public_id: String , videoDuration: String , originalDuration: Number },
    _id: false,
    required: false,
  })
  videoUrl: { url: string; public_id: string , videoDuration : string , originalDuration: number };

  @Prop({
    type: [{ url: String, public_id: String, originalName: String }],
    _id: false,
    required: false,
  })
  attachments: { url: string; public_id: string; originalName: string }[];

  @Prop({ type: Number, min: 0 })
  position: number;

  @Prop({ type: Boolean, default: false })
  isFree: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: Course.name,
  })
  course: string;
}

export const LectureSchema = SchemaFactory.createForClass(Lecture);

// ✅ Add compound index on course + position for better performance in sorting/filtering
LectureSchema.index({ course: 1, position: 1 });
