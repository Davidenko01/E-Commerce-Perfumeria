import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsIn, Min } from 'class-validator';

export class FiltrosPerfumeDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsIn(['designer', 'niche', 'arabic'])
  tipo?: string;

  @IsOptional()
  @IsIn(['HOMBRE', 'MUJER', 'UNISEX'])
  genero?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoriaId?: number;

  @IsOptional()
  @IsString()
  concentracion?: string;
}
