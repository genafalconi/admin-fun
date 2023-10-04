import { Order } from 'src/schemas/order.schema';
import { AnimalAgeDto, AnimalDto, AnimalSizeDto, BrandDto, CategoryDto, PaymentType } from './types.dto';
import { Subproduct } from 'src/schemas/subprod.schema';
import { Buy } from 'src/schemas/buy.schema';
import { PopulateObject, UserFullData } from './populate.interface';
import { Product } from 'src/schemas/product.schema';
import { Expense } from 'src/schemas/expense.schema';

export class SellData {
  date: Date;
  user: string;
  address_id: string;
  products: Array<ProductDto>;
  total_sell: number;
  payment_type: PaymentType;
}

export class ProductDto {
  name: string;
  quantity: number;
  subprod_id: Subproduct;
  profit: number;
}

export class ProductDataDto {
  name: string
  image: string
  description: string
  animal: AnimalDto
  animal_age: AnimalAgeDto
  brand: BrandDto
  category: CategoryDto
}

export class SubproductDataDto {
  product: string
  buy_price: number
  sell_price: number
  sale_price: number
  size: number
  stock: number
  animal: AnimalDto
  animal_age: AnimalAgeDto
  brand: BrandDto
  category: CategoryDto
  animal_size: AnimalSizeDto
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
  movements: Array<Order | Buy | UserFullData | Subproduct | Product | Expense>;
  total_movements: number;
  page: number;
  total_pages: number;
}

export class ReportDto {
  movements: Array<Order | Buy | Expense>;
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

export class UpdateUserBuyDto {
  user: string;
  next_buy: number;
}

export class WeekDto {
  start: string;
  end: string;
}

export class UserRebuyDto {
  _id: string;
  full_name: string;
  rebuydate: string;
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

export class ExpenseData {
  date: Date
  type: ExpenseTypeDto
  total: number
  description: string
}

export enum ExpenseTypeDto {
  FUEL = 'FUEL',
  SALARY = 'SALARY',
  OTHER = 'OTHER'
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
