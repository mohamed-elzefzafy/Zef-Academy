import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TestDocument = HydratedDocument<Test>;
@Schema({ timestamps: true })
export class Test {
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
}

export const TestSchema = SchemaFactory.createForClass(Test);
