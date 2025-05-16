import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsBoolean,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBrandSupplierDto {
  @ApiProperty({
    example: 'Proveedor11 Ejemplo',
    description: 'Nombre completo del proveedor',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    example: null,
    description: 'Persona de contacto en el proveedor',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  contactPerson?: string;

  @ApiProperty({
    example: 'proveedor11@ejemplo.com',
    description: 'Email único del proveedor',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 100)
  email: string;

  @ApiPropertyOptional({
    example: null,
    description: 'Teléfono de contacto (10 dígitos)',
    minLength: 10,
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @Length(10, 10)
  phone?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'Dirección completa del proveedor',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 10,
    description: 'ID de la marca asociada al proveedor',
  })
  @IsNotEmpty()
  @IsInt()
  brandId: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el proveedor está activo',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
