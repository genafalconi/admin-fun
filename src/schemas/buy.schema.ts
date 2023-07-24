import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentType, StatusOrder } from '../dto/types.dto';
import { Subproduct } from './subprod.schema';

@Schema({ timestamps: true })
export class Buy extends Document {
  @Prop({
    type: [
      {
        _id: false,
        subproduct: { type: Types.ObjectId, ref: 'Subproduct' },
        quantity: 'number',
      },
    ],
  })
  products: {
    subproduct: Subproduct;
    quantity: number;
  }[];

  @Prop({ required: true, default: new Date() })
  date: Date;

  @Prop({ required: true })
  total_buy: number;
}

export const BuySchema = SchemaFactory.createForClass(Buy);
