import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { Contains, IsInt, IsOptional, IsString } from 'class-validator';
import { StatusTask } from 'src/types/types';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  user_id: number;
}
