import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsBoolean} from 'class-validator';

const toBoolean = ({ value }) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const v = value.toLowerCase();
    if (v === 'true' || v === '1') return true;
    if (v === 'false' || v === '0') return false;
  }
  return value;
};

export class GetProductsFilterDto {
    
  @IsOptional() @IsString()
  search?: string;

  @IsOptional() @IsString()
  brand?: string;

  @IsOptional() @IsString()
  type?: string;

  @IsOptional() @IsString()
  gender?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;
  
  @IsOptional() 
  @Transform(toBoolean)
  @IsBoolean()
  onSale?: boolean;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  inStock?: boolean;
}