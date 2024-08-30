import { PartialType } from '@nestjs/mapped-types';
import { CreateReminderDto } from './create-reminder.dto';
import { StatusReminder } from '@prisma/client';
import { Contains, IsDate, IsOptional, Length } from 'class-validator';

export class UpdateReminderDto extends PartialType(CreateReminderDto) {
  @IsOptional()
  @Length(1, 35)
  title?: string;

  @IsOptional()
  @Length(1, 255)
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsDate()
  reminder_date?: Date;

  @IsOptional()
  @Contains('open' || 'finished' || 'canceled')
  status?: StatusReminder;
}
