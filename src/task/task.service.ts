import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindByCompanyDto } from './dto/find-by-company.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTaskDto) {
    try {
      return await this.prisma.task.create({
        data: {
          ...data,
          status: 'backlog',
        },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async findByCompany(id: number, query: FindByCompanyDto) {
    try {
      let whereCondition = {};

      if (query.title) {
        whereCondition = {
          ...whereCondition,
          title: {
            contains: query.title,
          },
        };
      }

      if (query.description) {
        whereCondition = {
          ...whereCondition,
          description: {
            contains: query.description,
          },
        };
      }

      if (query.status) {
        whereCondition = {
          ...whereCondition,
          status: query.status,
        };
      }

      if (query.user_responsible_id) {
        whereCondition = {
          ...whereCondition,
          user_responsible_id: query.user_responsible_id,
        };
      }

      return this.prisma.task.findMany({
        where: {
          ...whereCondition,
          company_id: id,
        },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.task.findUnique({
        where: {
          id,
        },
        include: {
          user: true,
          taskComment: true,
          company: true,
        },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async update(id: number, data: UpdateTaskDto) {
    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id,
        },
      });

      if (task.user_responsible_id !== data.user_id) {
        throw new Error('You are not allowed to update this task');
      } else {
        return await this.prisma.task.update({
          where: {
            id,
          },
          data: {
            title: data.title,
            description: data.description,
          },
        });
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async remove(id: number, user_id: number) {
    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id,
        },
      });

      if (task.user_responsible_id !== user_id) {
        throw new Error('You are not allowed to delete this task');
      } else {
        return await this.prisma.task.delete({
          where: {
            id,
          },
        });
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
