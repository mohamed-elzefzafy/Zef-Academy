import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Lecture>;
@Schema({ timestamps: true })
export class Lecture {
  @Prop({ type: String, required: true, minlength: 3 })
  title: string;

  @Prop({
    type: { url: String, public_id: String },
    _id: false,
    required: false,
  })
  videoUrl: { url: string; public_id: string };

      @Prop({
      type: [{ url: String, public_id: String  }],
      _id: false,
      required: false,
    })
    attachments: { url: string; public_id: string }[];

  @Prop({ type: Number, min: 0 })
  position: number;

  @Prop({ type: Boolean, default: false })
  isPublished: boolean;

  @Prop({ type: Boolean, default: false })
  isFree: boolean;

  // Course
  // teacher
}

export const LectureSchema = SchemaFactory.createForClass(Lecture);
