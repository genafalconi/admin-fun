import { Address } from 'src/schemas/address.schema';
import { Order } from 'src/schemas/order.schema';
import { User } from 'src/schemas/user.schema';

export interface PopulateObject {
  path: string;
  model: string;
  select?: string;
  populate?: PopulateObject | PopulateObject[];
}

export interface UserFullData extends User {
  last_address?: Address;
  last_order?: Order;
  next_buy?: Date;
}

export class UserFullDataDto {
  _id: string
  email: string
  full_name: string
  active: boolean
  admin: boolean
  phone: string
  provider_login: string
  firebase_id: string
  last_address?: Address
  last_order?: Order
  next_buy?: Date
}
