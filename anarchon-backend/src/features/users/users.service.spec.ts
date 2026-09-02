import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Gender } from './enums/gender.enum';

describe('UsersService', () => {
  let service: UsersService;
  const repo = {
    findOne: jest.fn(),
    create: jest.fn((data: unknown) => data),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();
    service = module.get(UsersService);
  });

  describe('findByEmail', () => {
    it('delegates to the repository without selecting the password hash', async () => {
      repo.findOne.mockResolvedValue({ id: '1', email: 'a@a.com' });
      const result = await service.findByEmail('a@a.com');
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { email: 'a@a.com' },
      });
      expect(result).toEqual({ id: '1', email: 'a@a.com' });
    });
  });

  describe('findByEmailWithPasswordHash', () => {
    it('explicitly selects the password hash', async () => {
      repo.findOne.mockResolvedValue({
        id: '1',
        email: 'a@a.com',
        passwordHash: 'hashed',
      });
      const result = await service.findByEmailWithPasswordHash('a@a.com');
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { email: 'a@a.com' },
        select: [
          'id',
          'email',
          'passwordHash',
          'name',
          'gender',
          'createdAt',
          'updatedAt',
        ],
      });
      expect(result?.passwordHash).toBe('hashed');
    });
  });

  describe('findById', () => {
    it('delegates to the repository', async () => {
      repo.findOne.mockResolvedValue({ id: '1', email: 'a@a.com' });
      const result = await service.findById('1');
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual({ id: '1', email: 'a@a.com' });
    });
  });

  describe('create', () => {
    it('creates and saves a new user', async () => {
      const input = {
        email: 'a@a.com',
        passwordHash: 'hashed',
        name: 'Ada',
        gender: Gender.FEMME,
      };
      repo.save.mockResolvedValue({ id: '1', ...input });

      const result = await service.create(input);

      expect(repo.create).toHaveBeenCalledWith(input);
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual({ id: '1', ...input });
    });
  });
});
