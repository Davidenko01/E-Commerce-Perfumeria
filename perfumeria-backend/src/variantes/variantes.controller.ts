import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VariantesService } from './variantes.service';
import { CreateVarianteDto } from './dto/create-variante.dto';
import { UpdateVarianteDto } from './dto/update-variante.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/role.decorator';

@Controller('variantes')
export class VariantesController {
  constructor(private readonly variantesService: VariantesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateVarianteDto) {
    return this.variantesService.create(dto);
  }

  @Get()
  findAll(
    @Query('perfumeId') perfumeId?: string,
    @Query('activo') activo?: string,
  ) {
    const filters: { perfumeId?: number; activo?: boolean } = {};

    if (perfumeId) {
      filters.perfumeId = parseInt(perfumeId, 10);
    }

    if (activo !== undefined) {
      filters.activo = activo === 'true';
    }

    return this.variantesService.findAll(filters);
  }

  @Get('sku/:sku')
  findBySku(@Param('sku') sku: string) {
    return this.variantesService.findBySku(sku);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.variantesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVarianteDto,
  ) {
    return this.variantesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.variantesService.remove(id);
  }

  @Post(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.variantesService.activate(id);
  }

  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('cantidad') cantidad: number,
  ) {
    return this.variantesService.updateStock(id, cantidad);
  }
}
