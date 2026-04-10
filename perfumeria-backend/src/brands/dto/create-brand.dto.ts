import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateBrandDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;
}