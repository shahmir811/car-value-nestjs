import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(0)
  @Max(1000000) // 1 million USDs
  price: number;

  @IsNumber()
  @Min(1930)
  @Max(2025)
  year: number;

  @IsNumber()
  @Min(0)
  @Max(1000000) // 1 million miles
  mileage: number;

  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;
}
