import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  @IsEnum(['dev', 'prod', 'test'])
  @IsOptional()
  NODE_ENV: string = 'dev';

  @IsNumber()
  PORT: number = 3000;

  @IsUrl({ require_tld: false, require_valid_protocol: false }) 
  DATABASE_URL: string;

  @IsString()
  @MinLength(32, { message: 'El JWT_SECRET debe tener al menos 32 caracteres por seguridad' })
  JWT_SECRET: string;

  @IsNumber()
  @IsOptional()
  JWT_EXPIRES_IN: number = 28800;

  @IsString()
  CORS_ORIGIN: string;

  @IsNumber()
  COSTO_ENVIO_DEFAULT: number;

  @IsString()
  @IsOptional()
  MP_ACCESS_TOKEN: string;
}

export function validate(config: Record<string, unknown>) {
  // Transforma el objeto genérico en una instancia de nuestra clase
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );

  // Valida sincrónicamente
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(`Error en variables de entorno: ${errors.toString()}`);
  }
  return validatedConfig;
}