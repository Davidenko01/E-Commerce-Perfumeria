import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CrearCategoriaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNotEmpty()
  @IsString()
  slug: string;
}
