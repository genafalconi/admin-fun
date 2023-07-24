import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentType, StatusOrder } from '../dto/types.dto';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Cart', required: false })
  cart: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Address', required: false })
  address: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Offer', required: false })
  offer: Types.ObjectId;

  @Prop({ required: true })
  payment_type: PaymentType;

  @Prop({ default: false })
  message_sent: boolean;

  @Prop({ default: StatusOrder.CONFIRMED })
  status: StatusOrder;

  @Prop({ default: true })
  ecommerce: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
