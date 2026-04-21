import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsBoolean, IsNotEmpty, MaxLength, Min, Max, IsIn, IsUrl, IsArray, ArrayMinSize } from 'class-validator';

const toBoolean = ({ value }) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const v = value.toLowerCase();
    if (v === 'true' || v === '1') return true;
    if (v === 'false' || v === '0') return false;
  }
  return value;
};

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  name: string

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  brandId: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, {each: true})
  categoriesId: number[]

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @IsNotEmpty()
  @Transform(toBoolean)
  @IsBoolean()
  isActive: boolean;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  volume: number;

  @IsNotEmpty()
  @IsIn(['man', 'woman', 'unisex'])
  gender: 'man' | 'woman' | 'unisex';

  @IsNotEmpty()
  @IsIn(['designer', 'niche', 'arabic'])
  type: 'designer' | 'niche' | 'arabic';

  @IsNotEmpty()
  @IsIn(['EF', 'EDC', 'EDT', 'EDP', 'Parfum', 'Elixir'])
  concentration: 'EF' | 'EDC' | 'EDT' | 'EDP' | 'Parfum' | 'Elixir';

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
