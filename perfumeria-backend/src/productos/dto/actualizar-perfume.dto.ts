import { PartialType } from '@nestjs/mapped-types';
import { CrearPerfumeDto } from './crear-perfume.dto';

export class ActualizarPerfumeDto extends PartialType(CrearPerfumeDto) {}
