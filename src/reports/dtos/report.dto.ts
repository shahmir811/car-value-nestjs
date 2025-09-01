import { Expose, Transform, Type } from 'class-transformer';
import { UserDto } from '../../users/dtos/user.dto';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  mileage: number;

  @Expose()
  approved: boolean;

  @Expose()
  lat: number;

  @Expose()
  lng: number;

  @Transform(({ obj }) => (obj.user ? obj.user.id : null))
  @Expose()
  userId: number;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}
