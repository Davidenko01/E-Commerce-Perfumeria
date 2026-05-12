import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsBoolean,
  IsArray,
  IsUrl,
  MaxLength,
  IsPositive,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Concentracion, Genero, TipoNota } from '../../generated/prisma/client';
import { CreateVarianteDto } from './crear-variante-perfume.dto';

export class NotaPerfumeDto {
  @IsInt()
  @IsPositive()
  notaId: number;

  @IsEnum(TipoNota)
  tipoNota: TipoNota;
}

export class CrearPerfumeDto {
  @IsInt()
  @IsPositive()
  marcaId: number;

  @IsInt()
  @IsPositive()
  categoriaId: number;

  @IsString()
  @MaxLength(200)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsEnum(Concentracion)
  concentracion: Concentracion;

  @IsEnum(Genero)
  genero: Genero;

  @IsInt()
  @IsPositive()
  familiaOlfativaId: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;

  @IsUrl()
  imagenUrl: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  galeriaImagenes?: string[] = [];

  @IsString()
  slug: string;

  @IsOptional()
  @IsBoolean()
  destacado?: boolean = false;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotaPerfumeDto)
  notas?: NotaPerfumeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVarianteDto)
  variantes: CreateVarianteDto[];
}
