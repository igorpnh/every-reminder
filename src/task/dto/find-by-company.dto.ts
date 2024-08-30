import { Contains, IsInt, IsOptional, IsString } from 'class-validator';

export class FindByCompanyDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Contains('backlog' || 'pending' || 'progress' || 'finished' || 'canceled')
  status?: string;

  @IsInt()
  company_id: number;

  @IsOptional()
  @IsInt()
  user_responsible_id?: number;
}
