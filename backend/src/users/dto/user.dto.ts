import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'password123',
    description: 'Senha do usuário',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    example: -15.7942,
    description: 'Latitude da localização do usuário',
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({
    example: -47.8822,
    description: 'Longitude da localização do usuário',
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'João Silva Santos',
    description: 'Nome completo do usuário',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'newpassword123',
    description: 'Nova senha do usuário',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    example: -15.7942,
    description: 'Latitude da localização do usuário',
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({
    example: -47.8822,
    description: 'Longitude da localização do usuário',
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class UserResponseDto {
  @ApiProperty({ example: 'uuid-string', description: 'ID único do usuário' })
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email do usuário',
  })
  email: string;

  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário',
  })
  name: string;

  @ApiProperty({
    example: false,
    description: 'Se o usuário é administrador',
  })
  isAdmin: boolean;

  @ApiProperty({
    example: 25,
    description: 'Pontos do usuário',
  })
  points: number;

  @ApiPropertyOptional({
    example: -15.7942,
    description: 'Latitude da localização do usuário',
  })
  latitude?: number | null;

  @ApiPropertyOptional({
    example: -47.8822,
    description: 'Longitude da localização do usuário',
  })
  longitude?: number | null;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Data de criação',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Data de atualização',
  })
  updatedAt: Date;
}
