import { StatusReminder } from '@prisma/client';
import {
  Contains,
  IsDate,
  IsNumber,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateReminderDto {
  @IsDate()
  reminder_date: Date;

  @Length(1, 35)
  title: string;

  @Length(1, 255)
  @IsOptional()
  description?: string;

  @IsNumber()
  user_id: number;
}
