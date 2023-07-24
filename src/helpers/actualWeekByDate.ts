import { WeekDto } from 'src/dto/admin.dto';

export default function getStartAndEndOfWeek(): WeekDto {
  const date = new Date();
  const dayOfWeek = date.getDay();

  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - diff);
  startOfWeek.setHours(-3, 0, 0, 0);

  const endOfWeek = new Date(date);
  endOfWeek.setDate(date.getDate() + (6 - diff));
  endOfWeek.setHours(20, 59, 59, 999);

  return {
    start: startOfWeek.toISOString().slice(0, 10),
    end: endOfWeek.toISOString().slice(0, 10),
  };
}
