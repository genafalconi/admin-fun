import { Model, Types } from "mongoose"
import { Cart } from "src/schemas/cart.schema"
import { SubproductBought } from "src/schemas/subprodsBought.schema"

export default async function createSubproductBought(
  cart: Cart,
  subproductBoughtModel: Model<SubproductBought>
): Promise<SubproductBought[]> {
  const subprods: SubproductBought[] = []
  for (let subprod of cart.subproducts) {
    const subprodBought = new subproductBoughtModel({
      subproduct: new Types.ObjectId(subprod.subproduct._id),
      buy_price: subprod.subproduct.buy_price,
      sale_price: subprod.subproduct.sale_price,
      sell_price: subprod.subproduct.sell_price,
      highlight: subprod.subproduct.highlight,
      quantity: subprod.quantity,
      buy_date: new Date()
    })
    subprods.push(subprodBought)
    await subproductBoughtModel.create(subprodBought)
  }
  return subprods
}