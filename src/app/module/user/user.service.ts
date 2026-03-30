import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';
import config from 'src/app/config';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (user)
      throw new HttpException('user alrady exists', HttpStatus.BAD_REQUEST);

    const hashPassword = await bcrypt.hash(
      createUserDto.password,
      Number(config.bcryptSaltRounds) || 10,
    );

    const result = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashPassword,
      },
    });

    return result;
  }
}
