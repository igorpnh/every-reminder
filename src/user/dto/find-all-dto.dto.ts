import { IsInt, IsOptional, Min } from 'class-validator';
import { User } from '../entities/user.entity';

export class FindAllDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  perPage?: number;

  @IsOptional()
  email?: string;
}
