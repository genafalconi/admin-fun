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
}
