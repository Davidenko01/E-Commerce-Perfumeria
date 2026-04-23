import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CrearVariantePerfumeDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  volumen: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precio: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsNotEmpty()
  @IsString()
  sku: string;
}

export class CrearPerfumeDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  marcaId: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  categoriaId: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  concentracion?: 'EF' | 'EDC' | 'EDT' | 'EDP' | 'PARFUM' | 'ELIXIR';

  @IsNotEmpty()
  @IsString()
  genero: 'HOMBRE' | 'MUJER' | 'UNISEX';

  @IsOptional()
  @IsString()
  tipo?: 'designer' | 'niche' | 'arabic';

  @IsOptional()
  @IsUrl()
  imagenUrl?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsArray()
  @IsNotEmpty()
  variantes: CrearVariantePerfumeDto[];
}
