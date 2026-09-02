import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsUrl, IsNumberString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsNotEmpty()
  declare DATABASE_URL: string;

  @IsOptional()
  @IsNotEmpty()
  declare DATABASE_URL_TEST?: string;

  @IsNotEmpty()
  declare JWT_SECRET: string;

  @IsNotEmpty()
  declare JWT_REFRESH_SECRET: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  declare FRONTEND_URL?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  declare MEDIA_BASE_URL?: string;

  @IsOptional()
  @IsNumberString()
  declare PORT?: string;
}

export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validated;
}
