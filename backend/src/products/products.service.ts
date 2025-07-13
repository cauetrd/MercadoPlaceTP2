import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProductDto,
  ProductResponseDto,
  ProductSearchDto,
  UpdateProductDto,
} from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
    userId?: string,
  ): Promise<ProductResponseDto> {
    // Verificar se produto com mesmo nome já existe
    const existingProduct = await this.prisma.product.findUnique({
      where: { name: createProductDto.name },
    });

    if (existingProduct) {
      throw new BadRequestException('Produto com este nome já existe');
    }

    // Criar produto simples
    const product = await this.prisma.product.create({
      data: createProductDto,
    });

    // Se o usuário estiver criando o produto, dar pontos
    if (userId) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: 1,
          },
        },
      });
    }

    return product;
  }

  async findAll(searchDto?: ProductSearchDto): Promise<ProductResponseDto[]> {
    const { name, userLatitude, userLongitude, sortBy, sortOrder } = searchDto || {};

    let where: any = {};

    if (name) {
      where.name = {
        contains: name,
      };
    }

    // Set up ordering - only allow valid fields
    let orderBy: any = {
      createdAt: 'desc',
    };

    if (sortBy && sortOrder) {
      const validSortFields = ['id', 'name', 'description', 'imageUrl', 'createdAt', 'updatedAt'];
      if (validSortFields.includes(sortBy)) {
        orderBy = {
          [sortBy]: sortOrder,
        };
      }
    }

    const products = await this.prisma.product.findMany({
      where,
      orderBy,
    });

    return products;
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    userId?: string,
  ): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Verificar se o nome já existe (se estiver sendo alterado)
    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { name: updateProductDto.name },
      });

      if (existingProduct) {
        throw new BadRequestException('Produto com este nome já existe');
      }
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    // Se o usuário estiver atualizando o produto, dar pontos
    if (userId) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: 1,
          },
        },
      });
    }

    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    await this.prisma.product.delete({ where: { id } });
  }
}
