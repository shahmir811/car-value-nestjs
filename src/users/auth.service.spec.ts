import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as crypto from 'crypto';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';
(global as any).crypto = crypto;

const scrypt = promisify(_scrypt);

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    // create a fake copy of user service
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('shahmir@shahmir.com', 'password');
    expect(user).toBeDefined();
    expect(user.password).not.toEqual('password');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('laskdjf@alskdfj.com', 'password');
    await expect(
      service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });

  // it('returns a user if correct password is provided', async () => {
  //   // Create a properly hashed password for the test
  //   const salt = randomBytes(8).toString('hex');
  //   const hash = (await scrypt('password', salt, 32)) as Buffer;
  //   const hashedPassword = `${salt}.${hash.toString('hex')}`;

  //   fakeUsersService.find = () =>
  //     Promise.resolve([
  //       {
  //         id: 1,
  //         email: 'shahmir@shahmir.com',
  //         password: hashedPassword,
  //       } as User,
  //     ]);

  //   const user = await service.signin('shahmir@shahmir.com', 'password');
  //   expect(user).toBeDefined();
  // });

  it('returns a user if correct password is provided', async () => {
    const user = await service.signup('shahmir@shahmir.com', 'password');
    const result = await service.signin('shahmir@shahmir.com', 'password');
    expect(result).toEqual(user);
  });
});
