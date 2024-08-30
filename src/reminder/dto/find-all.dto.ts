import { StatusReminder } from '@prisma/client';
import { Contains, IsInt, IsOptional, Min } from 'class-validator';

export class FindAllDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  month?: number;
  @IsOptional()
  @IsInt()
  @Min(2024)
  year?: number;
  @Contains('open' || 'finished' || 'canceled')
  status: StatusReminder;
}
