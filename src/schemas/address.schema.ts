import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Address extends Document {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  number: number;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  province: string;

  @Prop({ required: false })
  flat: string;

  @Prop({ required: false })
  floor: string;

  @Prop({ default: true })
  active: boolean;

  @Prop({ required: false })
  extra: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

AddressSchema.pre('findOneAndDelete', async function (this: Address) {
  await mongoose
    .model('User')
    .updateMany({ addresses: this._id }, { $pull: { addresses: this._id } });
});
