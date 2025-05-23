import { Controller, Get, Post, Body, Param, Put, Patch, Delete, ParseIntPipe, UseGuards, Request, Query , BadRequestException, InternalServerErrorException} from '@nestjs/common';
import { BrandSuppliersService } from './brand-suppliers.service';
import { CreateBrandSupplierDto } from './dto/create-brand-supplier.dto';
import { UpdateBrandSupplierDto } from './dto/update-brand-supplier.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { BrandSupplier } from './entities/brand-supplier.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@ApiTags('Proveedores de Marcas')
@Controller('brand-suppliers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BrandSuppliersController {
  constructor(private readonly brandSuppliersService: BrandSuppliersService) {}

  @Get()
@ApiOperation({ 
  summary: 'Obtener proveedores con filtros', 
  description: 'Obtiene todos los proveedores con opción de filtrar por marca y estado' 
})
@ApiQuery({ 
  name: 'brandId', 
  required: false, 
  type: Number,
  description: 'ID de la marca para filtrar proveedores',
  example: 1
})
@ApiQuery({ 
  name: 'isActive', 
  required: false, 
  type: Boolean,
  description: 'Filtrar por estado activo/inactivo',
  example: true
})
@ApiResponse({
  status: 200,
  description: 'Lista de proveedores filtrados',
  type: BrandSupplier,
  isArray: true,
  examples: {
    'Proveedores activos': {
      summary: 'Ejemplo de respuesta exitosa',
      value: [/*...como lo tienes arriba*/]
    },
    'Proveedores inactivos': {
      summary: 'Ejemplo de proveedores inactivos',
      value: [/*...como lo tienes arriba*/]
    }
  }
})
@ApiResponse({ status: 400, description: 'Parámetros inválidos' })
@ApiResponse({ status: 500, description: 'Error interno del servidor' })
async findAll(
  @Query('brandId') brandId?: string,
  @Query('isActive') isActive?: string,
): Promise<BrandSupplier[]> {
  try {
    const filters: { brandId?: number; isActive?: boolean } = {};

    // Validación y parsing de brandId
    if (brandId !== undefined) {
      const parsedBrandId = parseInt(brandId, 10);
      if (isNaN(parsedBrandId)) {
        throw new BadRequestException('El parámetro "brandId" debe ser un número válido.');
      }
      filters.brandId = parsedBrandId;
    }

    // Validación y parsing de isActive
    if (isActive !== undefined) {
      if (isActive !== 'true' && isActive !== 'false') {
        throw new BadRequestException('El parámetro "isActive" debe ser "true" o "false".');
      }
      filters.isActive = isActive === 'true';
    }

    return await this.brandSuppliersService.findAll(filters);

  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }
    console.error('Error al obtener proveedores:', error);
    throw new InternalServerErrorException('Ocurrió un error al obtener los proveedores.');
  }
}

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proveedor por ID' })
  @ApiParam({ 
    name: 'id', 
    example: 1, 
    description: 'ID del proveedor',
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Proveedor encontrado',
    type: BrandSupplier,
    examples: {
      'Proveedor encontrado': {
        summary: 'Ejemplo de proveedor existente',
        value: {
          supplierId: 1,
          name: 'Proveedor de Materiales Premium S.A.',
          contactPerson: 'Juan Pérez',
          email: 'contacto@proveedormaterials.com',
          phone: '9876543210',
          address: 'Av. Industrial 123, Lima, Perú',
          isActive: true,
          createdAt: '2023-05-15',
          updatedAt: '2023-05-20',
          brand: {
            brandId: 1,
            name: 'Nike'
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Proveedor no encontrado',
    examples: {
      'Proveedor no existe': {
        summary: 'Error cuando el proveedor no existe',
        value: {
          statusCode: 404,
          message: 'Proveedor con ID 999 no encontrado',
          error: 'Not Found'
        }
      }
    }
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number
  ): Promise<BrandSupplier> {
    return this.brandSuppliersService.findOne(id);
  }

   @Post()
  @ApiOperation({ 
    summary: 'Crear un nuevo proveedor',
    description: 'Registra un nuevo proveedor en el sistema. El email debe ser único.'
  })
  @ApiBody({ 
    type: CreateBrandSupplierDto,
    examples: {
      'Proveedor completo': {
        summary: 'Ejemplo con todos los campos',
        value: {
          name: 'Proveedor Completo S.A.',
          contactPerson: 'Ana García',
          email: 'contacto@proveedorcompleto.com',
          phone: '987654321',
          address: 'Calle Ejemplo 123, Lima, Perú',
          brandId: 2,
          isActive: true
        }
      },
      'Proveedor11 Ejemplo': {
        summary: 'Ejemplo completo con campos nulos',
        value: {
          id: 13,
          name: 'Proveedor11 Ejemplo',
          contactPerson: null,
          email: 'proveedor11@ejemplo.com',
          phone: null,
          address: null,
          isActive: true,
          createdAt: '2025-05-16',
          updatedAt: '2025-05-16',
          brandId: 10
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Proveedor creado exitosamente',
    type: BrandSupplier,
    examples: {
      'Proveedor creado': {
        summary: 'Ejemplo de respuesta exitosa',
        value: {
          supplierId: 2,
          name: 'Distribuidora Textil Nacional',
          contactPerson: 'María García',
          email: 'ventas@textilnacional.com',
          phone: '9123456789',
          address: 'Calle Comercial 456, Lima, Perú',
          isActive: true,
          createdAt: '2023-05-21',
          updatedAt: '2023-05-21',
          brand: {
            brandId: 2,
            name: 'Adidas'
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos',
    examples: {
      'Datos faltantes': {
        summary: 'Error de validación',
        value: {
          statusCode: 400,
          message: [
            'name should not be empty',
            'email must be an email',
            'brandId should not be empty'
          ],
          error: 'Bad Request'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: 'El email ya está registrado',
    examples: {
      'Email duplicado': {
        summary: 'Error de conflicto',
        value: {
          statusCode: 409,
          message: 'El email ya está registrado',
          error: 'Conflict'
        }
      }
    }
  })
  async create(
    @Body() createBrandSupplierDto: CreateBrandSupplierDto,
    @Request() req: { user: User },
  ): Promise<BrandSupplier> {
    return this.brandSuppliersService.create(createBrandSupplierDto, req.user);
  }


  @Put(':id')
  @ApiOperation({ 
    summary: 'Reemplazar completamente un proveedor',
    description: 'Actualiza todos los campos del proveedor. Para actualización parcial use PATCH.'
  })
  @ApiParam({ 
    name: 'id', 
    example: 1, 
    description: 'ID del proveedor a actualizar',
    type: Number
  })
  @ApiBody({ 
    type: CreateBrandSupplierDto,
    examples: {
      'Actualización completa': {
        summary: 'Ejemplo de actualización completa',
        value: {
          name: 'Nuevo Nombre del Proveedor',
          contactPerson: 'Nuevo Contacto',
          email: 'nuevo@email.com',
          phone: '987654321',
          address: 'Nueva Dirección 123',
          brandId: 2,
          isActive: false
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Proveedor actualizado completamente',
    type: BrandSupplier,
    examples: {
      'Proveedor actualizado': {
        summary: 'Ejemplo de respuesta exitosa',
        value: {
          supplierId: 1,
          name: 'Nuevo Nombre del Proveedor',
          contactPerson: 'Nuevo Contacto',
          email: 'nuevo@email.com',
          phone: '987654321',
          address: 'Nueva Dirección 123',
          isActive: false,
          createdAt: '2023-05-15',
          updatedAt: '2023-06-01',
          brand: {
            brandId: 2,
            name: 'Adidas'
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Proveedor no encontrado'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'El email ya está registrado'
  })
  async replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() createBrandSupplierDto: CreateBrandSupplierDto,
    @Request() req: { user: User },
  ): Promise<BrandSupplier> {
    return this.brandSuppliersService.replace(id, createBrandSupplierDto, req.user);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar parcialmente un proveedor',
    description: 'Actualiza solo los campos proporcionados del proveedor.'
  })
  @ApiParam({ 
    name: 'id', 
    example: 1, 
    description: 'ID del proveedor a actualizar',
    type: Number
  })
  @ApiBody({ 
    type: UpdateBrandSupplierDto,
    examples: {
      'Actualización parcial': {
        summary: 'Ejemplo de actualización parcial',
        value: {
          contactPerson: 'Nuevo Contacto Actualizado',
          phone: '912345678'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Proveedor actualizado parcialmente',
    type: BrandSupplier,
    examples: {
      'Proveedor actualizado': {
        summary: 'Ejemplo de respuesta exitosa',
        value: {
          supplierId: 1,
          name: 'Proveedor de Materiales Premium S.A.',
          contactPerson: 'Nuevo Contacto Actualizado',
          email: 'contacto@proveedormaterials.com',
          phone: '912345678',
          address: 'Av. Industrial 123, Lima, Perú',
          isActive: true,
          createdAt: '2023-05-15',
          updatedAt: '2023-06-01',
          brand: {
            brandId: 1,
            name: 'Nike'
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Proveedor no encontrado'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'El email ya está registrado'
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrandSupplierDto: UpdateBrandSupplierDto,
    @Request() req: { user: User },
  ): Promise<BrandSupplier> {
    return this.brandSuppliersService.update(id, updateBrandSupplierDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar un proveedor',
    description: 'Elimina permanentemente un proveedor del sistema.'
  })
  @ApiParam({ 
    name: 'id', 
    example: 1, 
    description: 'ID del proveedor a eliminar',
    type: Number
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Proveedor eliminado exitosamente',
    examples: {
      'Eliminación exitosa': {
        summary: 'Respuesta de éxito',
        value: {
          message: 'Proveedor con ID 1 eliminado exitosamente'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Proveedor no encontrado'
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: User },
  ): Promise<void> {
    return this.brandSuppliersService.remove(id, req.user);
  }
}