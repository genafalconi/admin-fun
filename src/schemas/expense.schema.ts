import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ExpenseTypeDto } from 'src/dto/admin.dto';

@Schema({ timestamps: true })
export class Expense extends Document {
  @Prop({ required: true, default: new Date() })
  date: Date;

  @Prop({ required: true })
  type: ExpenseTypeDto;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true })
  description: string;

}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
