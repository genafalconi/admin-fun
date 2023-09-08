import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  OrderFullDetailPopulateOptions,
  OrderStatusDto,
  PaginatedData,
  UpdateProductDto,
  UpdateUserBuyDto,
  UserPopulateOptions,
} from 'src/dto/admin.dto';
import { Order } from 'src/schemas/order.schema';
import { Product } from 'src/schemas/product.schema';
import { Subproduct } from 'src/schemas/subprod.schema';
import { AdminService } from './admin.service';
import { AnimalAgeDto, AnimalDto, AnimalSizeDto, BrandDto, CategoryDto } from 'src/dto/types.dto';
import { User } from 'src/schemas/user.schema';
import { Address } from 'src/schemas/address.schema';
import { UserFullData, UserFullDataDto } from 'src/dto/populate.interface';

@Injectable()
export class AdminAtomicService {
  constructor(
    @InjectModel(Subproduct.name)
    private readonly subproductModel: Model<Subproduct>,
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Address.name)
    private readonly addressModel: Model<Address>,
    @Inject(AdminService)
    private readonly adminService: AdminService,
  ) { }

  async changeActiveState(subprod_id: number): Promise<Subproduct> {
    const subprodToUpdate = await this.subproductModel.findById(
      new Types.ObjectId(subprod_id),
    );
    subprodToUpdate.active = !subprodToUpdate.active;

    return await subprodToUpdate.save();
  }

  async changeHighlightState(subprod_id: number): Promise<Subproduct> {
    const subprodToUpdate = await this.subproductModel.findById(
      new Types.ObjectId(subprod_id),
    );
    subprodToUpdate.highlight = !subprodToUpdate.highlight;

    return await subprodToUpdate.save();
  }

  async updateSubproduct(
    subprod_id: number,
    productUpdate: UpdateProductDto,
  ): Promise<any> {
    const [prod, subprod] = await Promise.all([
      this.productModel.findOneAndUpdate(
        { subproducts: { _id: new Types.ObjectId(subprod_id) } },
        productUpdate,
        { new: true },
      ),
      this.subproductModel
        .findByIdAndUpdate(
          new Types.ObjectId(subprod_id),
          productUpdate.subproducts[0],
          { new: true },
        )
        .populate({
          path: 'product',
          model: 'Product',
          select: '_id name image highlight active description',
        }),
    ]);
    return subprod;
  }

  async updateDeliverOrder(
    order_id: string,
    status: OrderStatusDto,
  ): Promise<Order[]> {
    // const future_status = orderStatusChange(status)
    const [updated, updated_orders] = await Promise.all([
      this.orderModel.updateOne(
        { _id: new Types.ObjectId(order_id) },
        { $set: { status: OrderStatusDto.DELIVERED } },
      ),
      this.adminService.getDeliveryOrders(),
    ]);
    return updated_orders.deliverys;
  }

  async getOrderDetails(order_id: string): Promise<Order> {
    return await this.orderModel
      .findById(new Types.ObjectId(order_id))
      .populate(OrderFullDetailPopulateOptions);
  }

  getTypesForProduct(): Object {
    const categories: string[] = Object.keys(CategoryDto)
    const animals: string[] = Object.keys(AnimalDto)
    const animal_age: string[] = Object.keys(AnimalAgeDto)
    const animal_size: string[] = Object.keys(AnimalSizeDto)
    const brands: string[] = Object.keys(BrandDto)

    return { categories, animals, animal_age, animal_size, brands }
  }

  async updateNextBuy(nextBuyData: UpdateUserBuyDto): Promise<UserFullDataDto> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      new Types.ObjectId(nextBuyData.user),
      { $inc: { period_buy: nextBuyData.next_buy } },
      { new: true }
    ).populate(UserPopulateOptions).select('_id full_name phone addresses orders period_buy')

    return await this.updateUserData(updatedUser)
  }

  async updateUserData(user: User): Promise<UserFullDataDto> {
    const userData: UserFullDataDto = {
      _id: user._id,
      email: user.email,
      full_name: user.full_name,
      active: user.active,
      admin: user.admin,
      phone: user.phone,
      provider_login: user.provider_login,
      firebase_id: user.firebase_id,
      last_address: null,
      last_order: null,
      next_buy: null
    };
    const lastAddressId = user.addresses[user.addresses.length - 1];
    const lastOrderId = user.orders[user.orders.length - 1];

    const [lastAddress, lastOrder] = await Promise.all([
      this.addressModel
        .findById(lastAddressId)
        .select('_id street number extra')
        .lean()
        .exec(),
      this.orderModel
        .findById(lastOrderId)
        .select('_id createdAt')
        .lean()
        .exec(),
    ]);

    userData.last_address = lastAddress;
    userData.last_order = lastOrder;

    let nextBuyDate: Date;
    if (lastOrder && lastOrder['createdAt']) {
      const lastOrderDate = new Date(lastOrder['createdAt']);
      nextBuyDate = new Date(lastOrderDate.getTime() + user.period_buy * 24 * 60 * 60 * 1000);
    }
    userData.next_buy = nextBuyDate;

    return userData;
  }
}
