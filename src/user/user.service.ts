import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { FindAllDto } from './dto/find-all-dto.dto';
import { UpdateProfileDto } from './dto/update-profile';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const haveUser = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (haveUser) {
      return 'User already exists';
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      return this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });
    }
  }

  async findAll(query: FindAllDto) {
    let whereCondition: { email?: { contains: string } } = {};

    if (query.email) {
      whereCondition.email = {
        contains: query.email,
      };
    }

    const users = await this.prisma.user.findMany({
      where: whereCondition,
      skip: Number(query.page)
        ? (Number(query.page) - 1) * Number(query.perPage)
        : undefined,
      take: Number(query.perPage),
    });

    const count = await this.prisma.user.count({
      where: whereCondition,
    });

    if (count === 0) {
      return { users: [], count };
    }

    return { users, count };
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        reminders: true,
        company: true,
        companyHierarchy: true,
        task: true,
      },
    });
  }

  async update(id: number, data: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateProfile(id: number, data: UpdateProfileDto) {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { profile_image_url: true },
    });

    if (user?.profile_image_url) {
      const imagePath = path.join(
        __dirname,
        '../../uploads/profile-images',
        user.profile_image_url,
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await this.prisma.reminders.deleteMany({
      where: { user_id: id },
    });

    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
