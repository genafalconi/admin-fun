import { Model, Types } from 'mongoose';
import { SellData } from 'src/dto/admin.dto';
import { Cart } from 'src/schemas/cart.schema';

export function convertSellDataToCart(
  sellData: SellData,
  cartModel: Model<Cart>,
): Cart {
  const subproducts = sellData.products.map((product) => ({
    subproduct: product.subprod_id,
    quantity: product.quantity,
    profit: product.profit,
  }));

  const cart = new cartModel({
    subproducts,
    active: false,
    bought: true,
    total_products: sellData.products.length,
    total_price: sellData.total_sell,
    user: new Types.ObjectId(sellData.user.user_id),
  });

  return cart;
}
