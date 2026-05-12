import { Type } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  IsString,
  IsEnum,
  Min,
  Max,
  IsBooleanString,
} from 'class-validator';
import { Genero, Concentracion } from '../../generated/prisma/client';

export class FiltrosPerfumeDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsEnum(Genero)
  genero?: Genero;

  @IsOptional()
  @IsEnum(Concentracion)
  concentracion?: Concentracion;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  categoriaId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  familiaOlfativaId?: number;

  @IsOptional()
  @IsBooleanString()
  destacado?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 12;

  @IsOptional()
  @IsBooleanString()
  includeNotas?: string;
}
