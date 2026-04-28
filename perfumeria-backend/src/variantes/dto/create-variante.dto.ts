import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVarianteDto {
  @IsInt()
  @IsNotEmpty()
  perfumeId: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  volumen: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  precio: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsString()
  @IsNotEmpty()
  sku: string;
}
