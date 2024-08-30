import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });
      if (!user) {
        throw new Error('User not found');
      }
      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      const token = this.jwtService.sign({ id: user.id, email: user.email });
      return {
        token,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async refreshToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);

      if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
        throw new Error('Token JWT inválido');
      }

      const { id } = decoded as { id: number };

      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (user) {
        const newToken = this.jwtService.sign(
          { id: user.id, email: user.email },
          { expiresIn: '30d' },
        );
        return {
          token: newToken,
        };
      } else {
        throw new Error('User not found');
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
