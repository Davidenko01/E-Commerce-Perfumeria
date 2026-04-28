import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AgregarItemCarritoDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  varianteId: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cantidad: number;
}
