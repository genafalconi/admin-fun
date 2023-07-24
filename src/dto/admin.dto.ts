import { Order } from 'src/schemas/order.schema';
import { PaymentType } from './types.dto';
import { Subproduct } from 'src/schemas/subprod.schema';
import { Buy } from 'src/schemas/buy.schema';
import { PopulateObject, UserFullData } from './populate.interface';
import { Product } from 'src/schemas/product.schema';

export class SellData {
  date: Date;
  user: UserDto;
  address_id: string;
  products: Array<ProductDto>;
  total_sell: number;
  payment_type: PaymentType;
}

export class UserDto {
  user_id: string;
  address_id: string;
}

export class ProductDto {
  name: string;
  quantity: number;
  subprod_id: Subproduct;
  profit: number;
}

export class BuyData {
  date: string;
  discount: boolean;
  products: Array<ProductDto>;
  total_sell: number;
}

export class UpdateProductDto {
  description: string;
  image: string;
  name: string;
  subproducts: Array<UpdateSubproductDto>;
}

export class UpdateSubproductDto {
  active: boolean;
  buy_price: number;
  highlight: boolean;
  sell_price: number;
  size: number;
  stock: number;
}

export class UserData {
  email: string;
  name: string;
  phone: string;
  address: AddressData;
}

export class AddressData {
  street: string;
  number: number;
  flat: string;
  floor: string;
  city: string;
  province: string;
  extra: string;
}

export enum MovementType {
  VENTA = 'VENTA',
  COMPRA = 'COMPRA',
}

export class ResponseData {
  success: boolean;
  data: any;
}

export class PaginatedData {
  movements: Array<Order | Buy | UserFullData | Subproduct | Product>;
  total_movements: number;
  page: number;
  total_pages: number;
}

export class ReportDto {
  movements: Array<Order | Buy>;
  total_import: number;
  month: string;
  total_profit?: number;
  percentage?: number;
}

export class UserReportDto {
  _id: string;
  name: string;
  re_buy: Date;
  total_buys: number;
  last_buy: Date;
}

export class WeekDto {
  start: Date | string;
  end: Date | string;
}

export class DeliveryDto {
  week: WeekDto;
  deliverys: Order[];
}

export enum OrderStatusDto {
  CONFIRMED = 'CONFIRMED',
  DELIVERED = 'DELIVERED',
  PROGRESS = 'PROGRESS',
  CANCELLED = 'CANCELLED',
}

export const OrderPopulateOptions: Array<PopulateObject> = [
  {
    path: 'user',
    model: 'User',
    select: '_id full_name',
  },
  {
    path: 'address',
    model: 'Address',
    select: '_id street number',
  },
  {
    path: 'offer',
    model: 'Offer',
    select: '_id date weekday',
  },
  {
    path: 'cart',
    model: 'Cart',
    select: '_id subproducts total_price',
    populate: {
      path: 'subproducts.subproduct',
      model: 'Subproduct',
      select: '_id product sell_price buy_price size',
      populate: {
        path: 'product',
        model: 'Product',
        select: '_id name image',
      },
    },
  },
];

export const OrderFullDetailPopulateOptions: Array<PopulateObject> = [
  {
    path: 'user',
    model: 'User',
    select: '_id full_name',
  },
  {
    path: 'address',
    model: 'Address',
    select: '_id street number flat floor city extra',
  },
  {
    path: 'offer',
    model: 'Offer',
    select: '_id date weekday',
  },
  {
    path: 'cart',
    model: 'Cart',
    select: '_id subproducts total_price',
    populate: {
      path: 'subproducts.subproduct',
      model: 'Subproduct',
      select: '_id product sell_price buy_price size',
      populate: {
        path: 'product',
        model: 'Product',
        select: '_id name image',
      },
    },
  },
];

export const BuyPopulateOptions: Array<PopulateObject> = [
  {
    path: 'products.subproduct',
    model: 'Subproduct',
    select: '_id product sell_price buy_price size',
    populate: {
      path: 'product',
      model: 'Product',
      select: '_id name image',
    },
  },
];

export const UserPopulateOptions: Array<PopulateObject> = [
  {
    path: 'addresses',
    model: 'Address',
  },
  {
    path: 'orders',
    model: 'Order',
  },
];

export const SellPopulateOptions: Array<PopulateObject> = [
  {
    path: 'cart',
    model: 'Cart',
    select: '_id subproducts total_price',
    populate: {
      path: 'subproducts.subproduct',
      model: 'Subproduct',
      select: '_id product size',
      populate: {
        path: 'product',
        model: 'Product',
        select: '_id name',
      },
    },
  },
];

export const DeliveryPopulateOptions: Array<PopulateObject> = [
  {
    path: 'user',
    model: 'User',
    select: '_id full_name',
  },
  {
    path: 'offer',
    model: 'Offer',
    select: '_id date weekday',
  },
  {
    path: 'address',
    model: 'Address',
    select: '_id street number city flat floor extra',
  },
];
