import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Gender } from './enums/gender.enum';

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  name: string;
  gender: Gender;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  /** Includes `passwordHash`, which is excluded by default (`select: false`). For login only. */
  findByEmailWithPasswordHash(email: string): Promise<User | null> {
    return this.usersRepo.findOne({
      where: { email },
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
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  create(input: CreateUserInput): Promise<User> {
    const user = this.usersRepo.create(input);
    return this.usersRepo.save(user);
  }
}
