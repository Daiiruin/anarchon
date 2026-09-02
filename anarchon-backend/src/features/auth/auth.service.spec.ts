import { Test } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken, getDataSourceToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { RefreshSession } from './entities/refresh-session.entity';
import { UsersService } from '../users/users.service';
import { Gender } from '../users/enums/gender.enum';

describe('AuthService', () => {
  let service: AuthService;

  const usersService = {
    findByEmail: jest.fn(),
    findByEmailWithPasswordHash: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };
  const jwtService = { sign: jest.fn().mockReturnValue('signed-token') };
  const configService = {
    getOrThrow: jest.fn().mockReturnValue('test-secret'),
  };
  const refreshSessionsRepo = {
    findOne: jest.fn(),
    create: jest.fn((data: unknown) => data),
    save: jest.fn(),
    update: jest.fn(),
  };
  const manager = {
    update: jest.fn(),
    getRepository: jest.fn(() => refreshSessionsRepo),
  };
  const dataSource = {
    transaction: jest.fn((cb: (m: typeof manager) => unknown) => cb(manager)),
  };

  const baseUser = {
    id: '1',
    email: 'a@a.com',
    name: 'Ada',
    gender: Gender.FEMME,
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        {
          provide: getRepositoryToken(RefreshSession),
          useValue: refreshSessionsRepo,
        },
        { provide: getDataSourceToken(), useValue: dataSource },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  describe('register', () => {
    it('throws ConflictException when email already exists', async () => {
      usersService.findByEmail.mockResolvedValue(baseUser);
      await expect(
        service.register({
          email: 'a@a.com',
          password: 'pass1234',
          name: 'Ada',
          gender: Gender.FEMME,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('hashes password and returns tokens', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(baseUser);

      const result = await service.register({
        email: 'a@a.com',
        password: 'pass1234',
        name: 'Ada',
        gender: Gender.FEMME,
      });

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      const call = usersService.create.mock.calls[0][0] as {
        passwordHash: string;
      };
      expect(call.passwordHash).not.toBe('pass1234');
      await expect(bcrypt.compare('pass1234', call.passwordHash)).resolves.toBe(
        true,
      );
      expect(refreshSessionsRepo.save).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('throws UnauthorizedException for unknown email', async () => {
      usersService.findByEmailWithPasswordHash.mockResolvedValue(null);
      await expect(
        service.login({ email: 'x@x.com', password: 'pass1234' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for wrong password', async () => {
      usersService.findByEmailWithPasswordHash.mockResolvedValue({
        ...baseUser,
        passwordHash: await bcrypt.hash('correct', 10),
      });
      await expect(
        service.login({ email: 'a@a.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns tokens for valid credentials', async () => {
      const passwordHash = await bcrypt.hash('pass1234', 10);
      usersService.findByEmailWithPasswordHash.mockResolvedValue({
        ...baseUser,
        passwordHash,
      });
      const result = await service.login({
        email: 'a@a.com',
        password: 'pass1234',
      });
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
    });
  });

  describe('refresh', () => {
    it('throws UnauthorizedException when no session matches the token', async () => {
      refreshSessionsRepo.findOne.mockResolvedValue(null);
      await expect(service.refresh('some-raw-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when the session was revoked', async () => {
      refreshSessionsRepo.findOne.mockResolvedValue({
        id: 's1',
        userId: '1',
        revokedAt: new Date(),
        expiresAt: new Date(Date.now() + 10_000),
      });
      await expect(service.refresh('some-raw-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when the session has expired', async () => {
      refreshSessionsRepo.findOne.mockResolvedValue({
        id: 's1',
        userId: '1',
        revokedAt: null,
        expiresAt: new Date(Date.now() - 10_000),
      });
      await expect(service.refresh('some-raw-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('rotates the session: revokes the old one and issues a new pair', async () => {
      refreshSessionsRepo.findOne.mockResolvedValue({
        id: 's1',
        userId: '1',
        revokedAt: null,
        expiresAt: new Date(Date.now() + 10_000),
      });
      usersService.findById.mockResolvedValue(baseUser);

      const result = await service.refresh('some-raw-token');

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(manager.update).toHaveBeenCalledWith(
        RefreshSession,
        { id: 's1' },
        expect.objectContaining({ revokedAt: expect.any(Date) }),
      );
      expect(refreshSessionsRepo.save).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('revokes the session matching the token hash', async () => {
      await service.logout('some-raw-token');
      expect(refreshSessionsRepo.update).toHaveBeenCalledWith(
        { tokenHash: expect.any(String) },
        expect.objectContaining({ revokedAt: expect.any(Date) }),
      );
    });
  });
});
