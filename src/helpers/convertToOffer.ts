import { Model, Types } from 'mongoose';
import { SellData } from 'src/dto/admin.dto';
import { Offer } from 'src/schemas/offers.schema';

export async function convertSellDataToOffer(
  sellData: SellData,
  offerModel: Model<Offer>,
): Promise<Offer> {
  const weekday = getWeekday(new Date());
  const existOffer = await offerModel.findOne({ date: sellData.date });

  if (existOffer) {
    return existOffer;
  }

  return new offerModel({
    date: new Date().toISOString().slice(0, 10),
    from: 14,
    to: 20,
    open: true,
    weekday: weekday,
  });
}

function getWeekday(date: Date) {
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  switch (weekday) {
    case 'Sunday':
      return 'domingo';
    case 'Monday':
      return 'lunes';
    case 'Tuesday':
      return 'martes';
    case 'Wednesday':
      return 'miercoles';
    case 'Thursday':
      return 'jueves';
    case 'Friday':
      return 'viernes';
    case 'Saturday':
      return 'sabado';
    default:
      console.log('Invalid weekday');
  }
}
