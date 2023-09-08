import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { LandingType } from 'src/dto/types.dto';

@Schema({ timestamps: true })
export class Landing extends Document {
  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  type: LandingType;

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: '' })
  text: string;

  @Prop({ default: '' })
  name: string;
}

export const LandingSchema = SchemaFactory.createForClass(Landing);