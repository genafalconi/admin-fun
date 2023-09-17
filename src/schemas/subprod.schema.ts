import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  AnimalAgeDto,
  AnimalDto,
  AnimalSizeDto,
  BrandDto,
  CategoryDto,
} from '../dto/types.dto';
import { Product } from './product.schema';

@Schema()
export class Subproduct extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product' })
  product: Product;

  @Prop({ required: true })
  buy_price: number;

  @Prop({ required: true })
  sell_price: number;

  @Prop({ required: true })
  sale_price: number;

  @Prop({ required: true })
  size: number;

  @Prop({ required: false })
  category: CategoryDto;

  @Prop({ required: false })
  animal: AnimalDto;

  @Prop({ required: false })
  brand: BrandDto;

  @Prop({ required: false })
  animal_size: AnimalSizeDto;

  @Prop({ required: false })
  animal_age: AnimalAgeDto;

  @Prop({ required: true, default: true })
  active: boolean;

  @Prop({ required: true, default: 100 })
  stock: number;

  @Prop({ required: true, default: false })
  highlight: boolean;
}

export const SubproductSchema = SchemaFactory.createForClass(Subproduct);
