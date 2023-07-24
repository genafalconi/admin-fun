import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  full_name: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: false })
  admin: boolean;

  @Prop({ required: false })
  phone: string;

  @Prop({ default: 'password' })
  provider_login: string;

  @Prop({ default: null })
  firebase_id: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Address' }], default: [] })
  addresses: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Order' }], default: [] })
  orders: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
