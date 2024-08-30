import { StatusReminder } from '@prisma/client';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { StatusTask } from 'src/types/types';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  user_responsible_id: number;

  @IsInt()
  company_id: number;
}
