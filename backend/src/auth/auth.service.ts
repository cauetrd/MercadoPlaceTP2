import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserDto,
  LoginDto,
  UserResponseDto,
} from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ user: UserResponseDto; access_token: string }> {
    const { email, password, ...userData } = createUserDto;

    // Verificar se o usuário já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email já está em uso');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        ...userData,
      },
    });

    // Remover senha do retorno
    const { password: _, ...userWithoutPassword } = user;

    // Gerar token JWT
    const payload = { sub: user.id, email: user.email, isAdmin: user.isAdmin };
    const access_token = this.jwtService.sign(payload);
    return {
      user: userWithoutPassword,
      access_token,
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: UserResponseDto; access_token: string }> {
    const { email, password } = loginDto;

    // Buscar usuário
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Remover senha do retorno
    const { password: _, ...userWithoutPassword } = user;

    // Gerar token JWT
    const payload = { sub: user.id, email: user.email, isAdmin: user.isAdmin };
    const access_token = this.jwtService.sign(payload);

    return {
      user: userWithoutPassword,
      access_token,
    };
  }

  async validateUser(userId: string): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
