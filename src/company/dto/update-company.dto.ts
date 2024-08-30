import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { IsInt, IsString, Length, Min } from 'class-validator';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @IsString()
  @Length(1, 25)
  company_name: string;

  @IsInt()
  @Min(1)
  user_id: number;
}
