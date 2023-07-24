import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  BuyData,
  BuyPopulateOptions,
  DeliveryDto,
  DeliveryPopulateOptions,
  OrderPopulateOptions,
  PaginatedData,
  ReportDto,
  ResponseData,
  SellData,
  SellPopulateOptions,
  UserData,
  UserReportDto,
} from 'src/dto/admin.dto';
import { PopulateObject, UserFullData } from 'src/dto/populate.interface';
import getStartAndEndOfWeek from 'src/helpers/actualWeekByDate';
import { convertSellDataToCart } from 'src/helpers/convertToCart';
import { convertSellDataToOffer } from 'src/helpers/convertToOffer';
import { Address } from 'src/schemas/address.schema';
import { Buy } from 'src/schemas/buy.schema';
import { Cart } from 'src/schemas/cart.schema';
import { Offer } from 'src/schemas/offers.schema';
import { Order } from 'src/schemas/order.schema';
import { Product } from 'src/schemas/product.schema';
import { Subproduct } from 'src/schemas/subprod.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Subproduct.name)
    private readonly subproductModel: Model<Subproduct>,
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Address.name)
    private readonly addressModel: Model<Address>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    @InjectModel(Cart.name)
    private readonly cartModel: Model<Cart>,
    @InjectModel(Offer.name)
    private readonly offerModel: Model<Offer>,
    @InjectModel(Buy.name)
    private readonly buyModel: Model<Buy>,
  ) {}

  async createClientSell(sellData: SellData): Promise<ResponseData> {
    const response: ResponseData = {
      success: false,
      data: '',
    };

    const cartSell = convertSellDataToCart(sellData, this.cartModel);
    const offerSell = await convertSellDataToOffer(sellData, this.offerModel);

    const [savedCart, savedOffer] = await Promise.all([
      this.cartModel.create(cartSell),
      this.offerModel.create(offerSell),
    ]);

    const newSell = new this.orderModel({
      user: new Types.ObjectId(sellData.user.user_id),
      cart: new Types.ObjectId(savedCart._id),
      address: new Types.ObjectId(sellData.user.address_id),
      offer: new Types.ObjectId(offerSell._id),
      payment_type: sellData.payment_type,
      ecommerce: false,
    });

    const [createSell, userUpdate, sellSaved] = await Promise.all([
      await this.orderModel.create(newSell),
      await this.userModel.updateOne(
        { _id: sellData.user.user_id },
        { $push: { orders: newSell._id } },
      ),
      await this.orderModel
        .findOne({ _id: newSell })
        .populate(OrderPopulateOptions),
    ]);

    if (sellSaved) {
      response.success = true;
      response.data = sellSaved;
    }

    return response;
  }

  async getProductsMovementSearch(input: string): Promise<Product[]> {
    const [products] = await Promise.all([
      this.productModel
        .find({ name: { $regex: input, $options: 'i' } })
        .populate({
          path: 'subproducts',
          options: { sort: { size: 1 } },
          select: '_id sell_price buy_price size stock',
        })
        .select('_id name subproducts')
        .sort({ name: 1 })
        .lean(),
    ]);

    return products;
  }

  async getUserMovementSearch(input: string): Promise<User[]> {
    const [users] = await Promise.all([
      this.userModel
        .find({ full_name: { $regex: input, $options: 'i' } })
        .select('_id full_name addresses')
        .slice('addresses', -1)
        .sort({ full_name: 1 })
        .lean(),
    ]);

    return users;
  }

  async paginatedMovements(
    params: any,
    page = 1,
    model: Model<Order | Buy>,
    populates: Array<PopulateObject>,
  ): Promise<PaginatedData> {
    const movementsPerPage = 10;
    const skip = (page - 1) * movementsPerPage;
    const query = { ...params };

    const [movements, totalCount] = await Promise.all([
      model
        .find(query)
        .populate(populates)
        .sort({ date: -1 })
        .skip(skip)
        .limit(movementsPerPage)
        .lean()
        .exec(),
      model.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(totalCount / movementsPerPage);

    return {
      movements: movements,
      total_movements: totalCount,
      page: page,
      total_pages: totalPages,
    };
  }

  async getPaginatedOrders(page = 1): Promise<PaginatedData> {
    return await this.paginatedMovements(
      null,
      page,
      this.orderModel,
      OrderPopulateOptions,
    );
  }

  async getDeliveryOrders(): Promise<DeliveryDto> {
    const actualWeek = getStartAndEndOfWeek();
    const offersWithinWeek = await this.offerModel.find({
      date: {
        $gte: actualWeek.start,
        $lte: actualWeek.end,
      },
    });

    const offerIds = offersWithinWeek.map((offer) => offer._id);

    const ordersWithinWeek = await this.orderModel
      .find({ offer: { $in: offerIds } })
      .populate(DeliveryPopulateOptions);

    return {
      week: { start: actualWeek.start, end: actualWeek.end },
      deliverys: ordersWithinWeek,
    };
  }

  async createBuyProducts(buyData: BuyData): Promise<ResponseData> {
    const response: ResponseData = {
      success: false,
      data: '',
    };
    const products = buyData.products.map((product) => ({
      subproduct: product.subprod_id,
      quantity: product.quantity,
    }));
    const total_quantity = products.reduce((total, product) => {
      return total + product.quantity;
    }, 0);

    const newBuy = new this.buyModel({
      date: new Date(buyData.date),
      products,
      total_products: total_quantity,
      total_buy: buyData.discount
        ? buyData.total_sell * 0.95
        : buyData.total_sell,
    });

    const [createBuy, buySaved] = await Promise.all([
      await this.buyModel.create(newBuy),
      await this.buyModel
        .findOne({ _id: new Types.ObjectId(newBuy._id) })
        .populate(BuyPopulateOptions),
    ]);

    if (buySaved) {
      response.success = true;
      response.data = buySaved;

      await Promise.all(
        buyData.products.map(async (product) => {
          await this.subproductModel.findOneAndUpdate(
            { _id: product.subprod_id },
            { $inc: { stock: product.quantity } },
          );
        }),
      );
    }

    return response;
  }

  async getPaginatedBuys(page = 1): Promise<PaginatedData> {
    return await this.paginatedMovements(
      null,
      page,
      this.buyModel,
      BuyPopulateOptions,
    );
  }

  async createClientAndAddress(userData: UserData): Promise<ResponseData> {
    const response: ResponseData = {
      success: false,
      data: '',
    };
    const userExists = await this.userModel.findOne({ email: userData.email });
    if (userExists) {
      response.data = 'Ya existe un usuario con ese email';
      return response;
    }

    const newAddress = new this.addressModel({
      street: userData.address.street,
      number: userData.address.number,
      floor: userData.address.floor,
      flat: userData.address.flat,
      city: userData.address.city,
      province: userData.address.province,
      extra: userData.address.extra,
    });

    const newUser = new this.userModel({
      email: userData.email,
      full_name: userData.name,
      phone: userData.phone,
      addresses: [new Types.ObjectId(newAddress._id)],
    });

    const [createAddress, addressSaved, userSaved] = await Promise.all([
      await this.addressModel.create(newAddress),
      await this.userModel.create(newUser),
      await this.userModel.findById(newUser._id),
    ]);

    if (userSaved) {
      response.success = true;
      response.data = userSaved;
    }

    return response;
  }

  async getPaginatedUsers(page = 1): Promise<PaginatedData> {
    const pageSize = 15;
    const skip = (page - 1) * pageSize;

    const [users, totalUsers] = await Promise.all([
      this.userModel
        .find()
        .select('_id full_name phone addresses orders')
        .sort({ full_name: 1 })
        .skip(skip)
        .limit(pageSize)
        .lean()
        .exec(),
      this.userModel.countDocuments().exec(),
    ]);

    const updatedUsers: UserFullData[] = await Promise.all(
      users.map(async (user) => {
        const userData: UserFullData = { ...user };
        const lastAddressId = user.addresses[user.addresses.length - 1];
        const lastOrderId = user.orders[user.orders.length - 1];

        delete userData.addresses;
        delete userData.orders;

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

        return userData;
      }),
    );

    const totalPages = Math.ceil(totalUsers / pageSize);

    return {
      movements: updatedUsers,
      total_movements: totalUsers,
      page: page,
      total_pages: totalPages,
    };
  }

  async getPaginatedProducts(page = 1): Promise<PaginatedData> {
    const pageSize = 15;
    const skip = (page - 1) * pageSize;

    const [products, totalProducts] = await Promise.all([
      this.productModel
        .find()
        .select('_id name description image')
        .populate({
          path: 'subproducts',
          model: 'Subproduct',
          select: '_id buy_price sell_price size active stock highlight',
          options: { sort: { size: 1 } },
        })
        .sort({ name: 1 })
        .skip(skip)
        .limit(pageSize)
        .lean()
        .exec(),
      this.productModel.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(totalProducts / pageSize);

    return {
      movements: products,
      total_movements: totalProducts,
      page: page,
      total_pages: totalPages,
    };
  }

  getDatesFormatted(date?: string) {
    const currentDate = new Date(date);
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    startOfMonth.setUTCHours(0, 0, 0, 0);

    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );
    endOfMonth.setUTCHours(23, 59, 59, 999);

    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const formattedDate = {
      start: startOfMonth,
      end: endOfMonth,
      monthName: monthNames[currentDate.getMonth()],
    };
    return formattedDate;
  }

  async getBuysReport(date?: string) {
    let query = null;
    const responseReport: ReportDto = {
      movements: [],
      total_import: 0,
      month: '',
    };

    if (date) {
      const { start, end, monthName } = this.getDatesFormatted(date);
      responseReport.month = monthName;
      query = { createdAt: { $gte: start, $lt: end } };
    }

    const [buys] = await Promise.all([
      this.buyModel.find(query).select('_id date total_buy total_products'),
    ]);

    const totalBuys = buys.reduce((total, buy) => {
      return total + buy.total_buy;
    }, 0);

    responseReport.movements = buys;
    responseReport.total_import = totalBuys;
    responseReport.month = responseReport.month ? responseReport.month : 'All';

    return responseReport;
  }

  async getSellsReport(date?: string): Promise<ReportDto> {
    let query = null;
    const responseReport: ReportDto = {
      movements: [],
      total_import: 0,
      month: '',
      total_profit: 0,
      percentage: 0,
    };

    if (date) {
      const { start, end, monthName } = this.getDatesFormatted(date);
      responseReport.month = monthName;
      query = { createdAt: { $gte: start, $lt: end } };
    }

    const [sells] = await Promise.all([
      this.orderModel
        .find(query)
        .populate(SellPopulateOptions)
        .select('_id createdAt payment_type ecommerce cart'),
    ]);

    const totalSells = sells.reduce((total, sell) => {
      return total + sell.cart['total_price'];
    }, 0);

    const totalProfit = sells.reduce((sum, item) => {
      if (item.cart && item.cart['subproducts']) {
        const subproductProfit = item.cart['subproducts'].reduce(
          (subSum, subitem) => {
            return subSum + subitem.profit;
          },
          0,
        );
        return sum + subproductProfit;
      }
      return sum;
    }, 0);

    responseReport.movements = sells;
    responseReport.total_import = totalSells;
    responseReport.month = responseReport.month ? responseReport.month : 'All';
    responseReport.total_profit = totalProfit;
    responseReport.percentage = this.calculateMargin(totalProfit, totalSells);

    return responseReport;
  }

  calculateMargin(profit: number, total_import: number): number {
    const margin = (profit / total_import) * 100;
    const roundedMargin = Math.ceil(margin * 100) / 100;
    return parseFloat(roundedMargin.toFixed(2));
  }

  async getUsersReport() {
    const users = await this.userModel
      .find()
      .select('_id full_name')
      .populate({
        path: 'orders',
        model: 'Order',
        select: '_id cart offer',
        populate: [
          {
            path: 'cart',
            model: 'Cart',
            select: '_id total_price',
          },
          {
            path: 'offer',
            model: 'Offer',
            select: '_id date',
          },
        ],
      });

    const userReports: UserReportDto[] = users.map((user) => {
      const totalBuys = user.orders.reduce(
        (sum, order) => sum + order['cart'].total_price,
        0,
      );
      const lastBuy =
        user.orders.length > 0
          ? new Date(user.orders[user.orders.length - 1]['offer'].date)
          : null;

      let meanDifference = null;
      if (user.orders.length > 1) {
        const dateDifferences = user.orders.map((order, index) => {
          if (index > 0) {
            const current = new Date(order['offer']['date']);
            const previous = new Date(user.orders[index - 1]['offer']['date']);
            return current.getTime() - previous.getTime();
          }
          return 0;
        });
        const sumDifferences = dateDifferences.reduce(
          (sum, diff) => sum + diff,
          0,
        );
        const meanMilliseconds = sumDifferences / (user.orders.length - 1);
        meanDifference = new Date(lastBuy.getTime() + meanMilliseconds);
      } else if (lastBuy) {
        meanDifference = new Date(lastBuy.getTime() + 30 * 24 * 60 * 60 * 1000);
      }

      const userReport: UserReportDto = {
        _id: user._id,
        name: user.full_name,
        re_buy: meanDifference,
        total_buys: totalBuys,
        last_buy: lastBuy,
      };

      return userReport;
    });

    userReports.sort((a, b) => b.re_buy?.getTime() - a.re_buy?.getTime());

    return userReports;
  }
}
