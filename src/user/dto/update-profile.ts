import { IsOptional } from 'class-validator';
import { User } from '../entities/user.entity';

export class UpdateProfileDto {
  @IsOptional()
  profile_image_url?: string;
}
