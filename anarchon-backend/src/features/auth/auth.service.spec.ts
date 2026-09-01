import { Test } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  const repo = { findOne: jest.fn(), create: jest.fn(), save: jest.fn() };
  const jwt = { sign: jest.fn().mockReturnValue('signed-token') };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: repo },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  describe('register', () => {
    it('throws ConflictException when email already exists', async () => {
      repo.findOne.mockResolvedValue({ id: '1', email: 'a@a.com' });
      await expect(service.register({ email: 'a@a.com', password: 'pass1234' }))
        .rejects.toThrow(ConflictException);
    });

    it('hashes password and returns tokens', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue({ id: '1', email: 'a@a.com', password: 'hashed' });
      repo.save.mockResolvedValue({ id: '1', email: 'a@a.com', password: 'hashed' });

      const result = await service.register({ email: 'a@a.com', password: 'pass1234' });

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      const call = repo.create.mock.calls[0][0];
      expect(call.password).not.toBe('pass1234');
      await expect(bcrypt.compare('pass1234', call.password)).resolves.toBe(true);
    });
  });

  describe('login', () => {
    it('throws UnauthorizedException for unknown email', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.login({ email: 'x@x.com', password: 'pass1234' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for wrong password', async () => {
      repo.findOne.mockResolvedValue({
        id: '1',
        email: 'a@a.com',
        password: await bcrypt.hash('correct', 10),
      });
      await expect(service.login({ email: 'a@a.com', password: 'wrong' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('returns tokens for valid credentials', async () => {
      const hashed = await bcrypt.hash('pass1234', 10);
      repo.findOne.mockResolvedValue({ id: '1', email: 'a@a.com', password: hashed });
      const result = await service.login({ email: 'a@a.com', password: 'pass1234' });
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
    });
  });
});
