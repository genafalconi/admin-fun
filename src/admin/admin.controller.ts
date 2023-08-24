import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  BuyData,
  DeliveryDto,
  ExpenseData,
  PaginatedData,
  ReportDto,
  ResponseData,
  SellData,
  UserData,
} from 'src/dto/admin.dto';
import { Product } from 'src/schemas/product.schema';
import { User } from 'src/schemas/user.schema';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Post('/manual-sell')
  async createSellByClient(@Body() sellData: SellData): Promise<ResponseData> {
    return await this.adminService.createClientSell(sellData);
  }

  @Post('/manual-buy')
  async createBuyProducts(@Body() buyData: BuyData): Promise<ResponseData> {
    return await this.adminService.createBuyProducts(buyData);
  }

  @Post('/manual-client')
  async createClient(@Body() userData: UserData): Promise<ResponseData> {
    return await this.adminService.createClientAndAddress(userData);
  }

  @Post('/manual-expense')
  async createExpense(@Body() expenseData: ExpenseData): Promise<ResponseData> {
    return await this.adminService.createExpense(expenseData);
  }

  @Get('/search/product-movement')
  async getNonPaginateProducts(
    @Query('input') input: string,
  ): Promise<Product[]> {
    return await this.adminService.getProductsMovementSearch(input);
  }

  @Get('/search/user-movement')
  async getUsers(@Query('input') input: string): Promise<User[]> {
    return await this.adminService.getUserMovementSearch(input);
  }

  @Get('/delivery-orders')
  async getDeliveryOrders(): Promise<DeliveryDto> {
    return await this.adminService.getDeliveryOrders();
  }

  @Get('/orders')
  async getPaginatedOrders(
    @Query('page') page: string,
  ): Promise<PaginatedData> {
    return await this.adminService.getPaginatedOrders(parseInt(page));
  }

  @Get('/buys')
  async getPaginatedBuys(@Query('page') page: string): Promise<PaginatedData> {
    return await this.adminService.getPaginatedBuys(parseInt(page));
  }

  @Get('/users')
  async getPaginatedUsers(@Query('page') page: string): Promise<PaginatedData> {
    return await this.adminService.getPaginatedUsers(parseInt(page));
  }

  @Get('/products')
  async getPaginatedProducts(@Query('page') page: string): Promise<PaginatedData> {
    return await this.adminService.getPaginatedProducts(parseInt(page));
  }

  @Get('/expenses')
  async getPaginatedExpenses(@Query('page') page: string): Promise<PaginatedData> {
    return await this.adminService.getPaginatedExpenses(parseInt(page));
  }

  @Get('/report-buys')
  async getBuysReport(@Query('date') date?: string): Promise<ReportDto> {
    return await this.adminService.getBuysReport(date);
  }

  @Get('/report-sells')
  async getSellsReport(@Query('date') date?: string): Promise<ReportDto> {
    return await this.adminService.getSellsReport(date);
  }

  @Get('/report-users')
  async getUserReport(): Promise<any> {
    return await this.adminService.getUsersReport();
  }
}
