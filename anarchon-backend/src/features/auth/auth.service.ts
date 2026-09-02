import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Gender } from '../users/enums/gender.enum';
import { RefreshSession } from './entities/refresh-session.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  gender: Gender;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshSession)
    private readonly refreshSessionsRepo: Repository<RefreshSession>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async register(dto: RegisterDto): Promise<TokenPair> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
      gender: dto.gender,
    });

    return this.issueTokens(user);
  }

  async login(dto: LoginDto): Promise<TokenPair> {
    const user = await this.usersService.findByEmailWithPasswordHash(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokens(user);
  }

  async refresh(rawToken: string): Promise<TokenPair> {
    const tokenHash = this.hashToken(rawToken);
    const session = await this.refreshSessionsRepo.findOne({
      where: { tokenHash },
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findById(session.userId);
    if (!user) throw new UnauthorizedException();

    return this.dataSource.transaction(async (manager) => {
      await manager.update(
        RefreshSession,
        { id: session.id },
        { revokedAt: new Date() },
      );
      return this.issueTokens(user, manager);
    });
  }

  async logout(rawToken: string): Promise<void> {
    const tokenHash = this.hashToken(rawToken);
    await this.refreshSessionsRepo.update(
      { tokenHash },
      { revokedAt: new Date() },
    );
  }

  async getProfile(userId: string): Promise<Profile> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      gender: user.gender,
    };
  }

  private async issueTokens(
    user: User,
    manager?: EntityManager,
  ): Promise<TokenPair> {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    // jti guarantees a unique token (and therefore a unique tokenHash) even when
    // two refresh tokens are issued for the same user within the same second,
    // where sub/email/iat/exp would otherwise be identical and produce the same JWT.
    const refreshToken = this.jwtService.sign(
      { ...payload, jti: crypto.randomUUID() },
      {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    const refreshSessionsRepo = manager
      ? manager.getRepository(RefreshSession)
      : this.refreshSessionsRepo;
    await refreshSessionsRepo.save(
      refreshSessionsRepo.create({
        userId: user.id,
        tokenHash: this.hashToken(refreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      }),
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
