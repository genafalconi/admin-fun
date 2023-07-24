import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Offer extends Document {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  from: number;

  @Prop({ required: true })
  to: number;

  @Prop({ required: true })
  open: boolean;

  @Prop({ required: true })
  weekday: string;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
