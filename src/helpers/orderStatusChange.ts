import { OrderStatusDto } from 'src/dto/admin.dto';

export default function orderStatusChange(
  status: OrderStatusDto,
): OrderStatusDto {
  switch (status) {
    case OrderStatusDto.CONFIRMED:
      return OrderStatusDto.DELIVERED;
    case OrderStatusDto.DELIVERED:
      return OrderStatusDto.DELIVERED;
    case OrderStatusDto.PROGRESS:
      return OrderStatusDto.CONFIRMED;
    case OrderStatusDto.CANCELLED:
      return OrderStatusDto.CONFIRMED;
    default:
      return OrderStatusDto.DELIVERED;
  }
}
