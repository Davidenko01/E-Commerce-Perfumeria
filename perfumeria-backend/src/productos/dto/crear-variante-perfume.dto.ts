import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsDecimal,
  IsBoolean,
  Min,
  Max,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVarianteDto {
  @IsInt()
  @Min(1)
  @Max(1000)
  volumen: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  precio: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  precioComparativo?: number;

  @IsOptional()
  @IsString()
  etiquetaDescuento?: string;

  @IsOptional()
  @IsDateString()
  inicioDescuento?: string;

  @IsOptional()
  @IsDateString()
  finDescuento?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number = 0;

  @IsString()
  sku: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;
}
