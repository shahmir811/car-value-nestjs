import { Transform } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(2025)
  year: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1000000) // 1 million miles
  mileage: number;

  @IsLatitude()
  @Transform(({ value }) => parseFloat(value))
  lat: number;

  @IsLongitude()
  @Transform(({ value }) => parseFloat(value))
  lng: number;
}
