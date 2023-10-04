import { DateTime } from 'luxon';
import { WeekDto } from 'src/dto/admin.dto';

export default function getStartAndEndOfWeek(): WeekDto {
  const date = DateTime.now().setZone('America/Buenos_Aires');
  const dayOfWeek = date.weekday;

  const diff = dayOfWeek === 7 ? 6 : dayOfWeek - 1;

  const startOfWeek = date.minus({ days: diff }).startOf('day').setZone('America/Buenos_Aires');
  const endOfWeek = date.plus({ days: 6 - diff }).endOf('day').setZone('America/Buenos_Aires');

  return {
    start: startOfWeek.toISODate(),
    end: endOfWeek.toISODate(),
  };
}

