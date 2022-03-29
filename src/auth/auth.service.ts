import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dtos';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  private hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  private async getTokens(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        { expiresIn: 60 * 15, secret: 'at-secret' },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        { expiresIn: 60 * 60 * 24 * 7, secret: 'rt-secret' },
      ),
    ]);

    return { access_token: at, refresh_token: rt };
  }

  public async signupLocal(dto: AuthDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
    });
    return await this.getTokens(newUser.id, newUser.email);
  }

  public signinLocal() {}

  public logout() {}

  public refreshTokens() {}
}
