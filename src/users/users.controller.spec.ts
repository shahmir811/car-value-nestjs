import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) =>
        Promise.resolve([
          {
            id: 1,
            email,
            password: 'test',
          } as User,
        ]),
      findOne: (id: number) =>
        Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'test',
        } as User),
      remove: (id: number) =>
        Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'test',
        } as User),
      update: (id: number, attrs: Partial<User>) =>
        Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'test',
        } as User),
    };

    fakeAuthService = {
      signup: () =>
        Promise.resolve({
          id: 1,
          email: 'test@test.com',
          password: 'test',
        } as User),
      signin: (email: string, password: string) =>
        Promise.resolve({
          id: 1,
          email,
          password,
        } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  it('findUser retuns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user.id).toEqual(1);
    expect(user.email).toEqual('test@test.com');
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -100 };
    const user = await controller.signin(
      { email: 'test@test.com', password: 'test' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
