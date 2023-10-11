import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  BuyData,
  DeliveryDto,
  ExpenseData,
  PaginatedData,
  ProductDataDto,
  ReportDto,
  ResponseData,
  SellData,
  SubproductDataDto,
  UserData,
  UserRebuyDto,
  UserReportDto,
} from 'src/dto/admin.dto';
import { Product } from 'src/schemas/product.schema';
import { User } from 'src/schemas/user.schema';
import { LandingDto, LandingType } from 'src/dto/types.dto';
import { Landing } from 'src/schemas/landing.schema';
import { Subproduct } from 'src/schemas/subprod.schema';
import { FirebaseAuthGuard } from 'src/firebase/firebase.auth.guard';

@UseGuards(FirebaseAuthGuard)
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
  async getNonPaginateProducts(@Query('input') input: string): Promise<Product[]> {
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

  @Get('/users-week')
  async getUsersRebuyByWeek(): Promise<UserRebuyDto[]> {
    return await this.adminService.getRebuyUsersPerWeek()
  }

  @Get('/orders')
  async getPaginatedOrders(@Query('page') page: string): Promise<PaginatedData> {
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
    return await this.adminService.getPaginatedProducts(parseInt(page), null);
  }

  @Get('/expenses')
  async getPaginatedExpenses(@Query('page') page: string): Promise<PaginatedData> {
    return await this.adminService.getPaginatedExpenses(parseInt(page));
  }

  @Get('/report-buys')
  async getBuysReport(@Query('date') date?: string): Promise<ReportDto> {
    return await this.adminService.getBuysReport(date);
  }

  @Get('/report-expenses')
  async getExpensesReport(@Query('date') date?: string): Promise<ReportDto> {
    return await this.adminService.getExpensesReport(date);
  }

  @Get('/report-sells')
  async getSellsReport(@Query('date') date?: string): Promise<ReportDto> {
    return await this.adminService.getSellsReport(date);
  }

  @Get('/report-users')
  async getUserReport(): Promise<UserReportDto[]> {
    return await this.adminService.getUsersReport();
  }

  @Get('/product-search')
  async getProductSearch(@Query('page') page: string, @Query('text') text: string): Promise<PaginatedData> {
    return await this.adminService.getSearchedProducts(parseInt(page), text)
  }

  @Get('/landing-images')
  async getLandingImages(@Query('type') type?: LandingType): Promise<Landing[]> {
    return await this.adminService.getLandingImages(type)
  }

  @Put('/change-image')
  async changeLandingImage(@Body() landing: LandingDto): Promise<Landing> {
    return await this.adminService.changeLandingImage(landing)
  }

  @Post('/create-image')
  async addLandingImage(@Body() landing: LandingDto): Promise<Landing> {
    return await this.adminService.addLandingImage(landing)
  }

  @Get('/subprod/:subprod_id')
  async getSubproductDetails(@Param('subprod_id') subprod: string): Promise<Subproduct> {
    return await this.adminService.getSubproduct(subprod)
  }

  @Get('/products-excel')
  async getProductsToExcel() {
    return await this.adminService.getProductsToExcelFile()
  }

  @Post('/create-product')
  async createProduct(@Body() productData: ProductDataDto): Promise<Product> {
    return await this.adminService.createProduct(productData)
  }

  @Post('/create-subproduct')
  async createSubproduct(@Body() subprodData: SubproductDataDto): Promise<Subproduct> {
    return await this.adminService.createSubprodToProd(subprodData)
  }

  @Get('/stock')
  async updateStock() {
    return await this.adminService.updateStock()
  }

}
