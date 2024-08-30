import { IsEmail, IsInt, IsString, Length, Min } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @Length(1, 25)
  company_name: string;

  @IsInt()
  @Min(1)
  creator_id: number;
}
