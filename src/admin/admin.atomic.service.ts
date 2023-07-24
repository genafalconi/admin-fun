import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  OrderFullDetailPopulateOptions,
  OrderStatusDto,
  UpdateProductDto,
} from 'src/dto/admin.dto';
import { Order } from 'src/schemas/order.schema';
import { Product } from 'src/schemas/product.schema';
import { Subproduct } from 'src/schemas/subprod.schema';
import { AdminService } from './admin.service';

@Injectable()
export class AdminAtomicService {
  constructor(
    @InjectModel(Subproduct.name)
    private readonly subproductModel: Model<Subproduct>,
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    @Inject(AdminService)
    private readonly adminService: AdminService,
  ) {}

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
}
