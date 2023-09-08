import { Body, Controller, Put, Param, Get, Query } from '@nestjs/common';
import { OrderStatusDto, PaginatedData, UpdateProductDto, UpdateUserBuyDto } from 'src/dto/admin.dto';
import { AdminAtomicService } from './admin.atomic.service';
import { Subproduct } from 'src/schemas/subprod.schema';
import { Product } from 'src/schemas/product.schema';
import { Order } from 'src/schemas/order.schema';
import { User } from 'src/schemas/user.schema';
import { UserFullDataDto } from 'src/dto/populate.interface';

@Controller('admin-atomic')
export class AdminAtomicController {
  constructor(private readonly atomicService: AdminAtomicService) {}

  @Put('/active-change/:subprod_id')
  async changeActiveSubproduct(
    @Param('subprod_id') subprod_id: number,
  ): Promise<Subproduct> {
    return await this.atomicService.changeActiveState(subprod_id);
  }

  @Put('/highlight-change/:subprod_id')
  async changeHighlightSubproduct(
    @Param('subprod_id') subprod_id: number,
  ): Promise<Subproduct> {
    return await this.atomicService.changeHighlightState(subprod_id);
  }

  @Put('/subprod/:subprod_id')
  async updateSubproduct(
    @Param('subprod_id') subprod_id: number,
    @Body() prodUpdate: UpdateProductDto,
  ): Promise<Product> {
    return await this.atomicService.updateSubproduct(subprod_id, prodUpdate);
  }

  @Put('/order-status/:order_id')
  async deliveredOrder(
    @Param('order_id') orderId: string,
    @Query('status') status: OrderStatusDto,
  ): Promise<Order[]> {
    return await this.atomicService.updateDeliverOrder(orderId, status);
  }

  @Get('/details/:order_id')
  async getOrderDetails(@Param('order_id') orderId: string): Promise<Order> {
    return await this.atomicService.getOrderDetails(orderId);
  }

  @Get('/product-types')
  getProductTypes(): Object {
    return this.atomicService.getTypesForProduct()
  }

  @Put('/next-buy')
  async updateNextBuy(@Body() nextBuy: UpdateUserBuyDto): Promise<UserFullDataDto> {
    return await this.atomicService.updateNextBuy(nextBuy);
  }
}
