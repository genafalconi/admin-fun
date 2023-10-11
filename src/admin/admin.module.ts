import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Cart, CartSchema } from 'src/schemas/cart.schema';
import { Address, AddressSchema } from 'src/schemas/address.schema';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { Subproduct, SubproductSchema } from 'src/schemas/subprod.schema';
import { Offer, OfferSchema } from 'src/schemas/offers.schema';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { Buy, BuySchema } from 'src/schemas/buy.schema';
import { AdminAtomicController } from './admin.atomic.controller';
import { AdminAtomicService } from './admin.atomic.service';
import { Expense, ExpenseSchema } from 'src/schemas/expense.schema';
import { Landing, LandingSchema } from 'src/schemas/landing.schema';
import { SubproductBought, SubproductBoughtSchema } from 'src/schemas/subprodsBought.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Address.name, schema: AddressSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Subproduct.name, schema: SubproductSchema },
      { name: Offer.name, schema: OfferSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Buy.name, schema: BuySchema },
      { name: Expense.name, schema: ExpenseSchema },
      { name: Landing.name, schema: LandingSchema },
      { name: SubproductBought.name, schema: SubproductBoughtSchema }
    ]),
  ],
  controllers: [AdminController, AdminAtomicController],
  providers: [AdminService, AdminAtomicService],
})
export class AdminModule {}
