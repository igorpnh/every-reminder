import { Injectable } from '@nestjs/common';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatusReminder } from '@prisma/client';
import { FindAllDto } from './dto/find-all.dto';

@Injectable()
export class ReminderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReminderDto): Promise<string | {}> {
    const haveReminder = await this.prisma.reminders.findFirst({
      where: {
        reminder_date: data.reminder_date,
      },
    });

    if (haveReminder) {
      return 'Reminder already exists';
    } else {
      return this.prisma.reminders.create({
        data: {
          ...data,
          status: 'open',
        },
      });
    }
  }

  async findAll(query: FindAllDto): Promise<[] | {}> {
    const whereCondition: any = {};

    if (query.month && query.year) {
      whereCondition.reminder_date = {
        gte: new Date(query.year, query.month - 1, 1),
        lt: new Date(query.year, query.month, 1),
      };
    } else if (query.month) {
      const currentYear = new Date().getFullYear();
      whereCondition.reminder_date = {
        gte: new Date(currentYear, query.month - 1, 1),
        lt: new Date(currentYear, query.month, 1),
      };
    } else if (query.year) {
      whereCondition.reminder_date = {
        gte: new Date(query.year, 0, 1),
        lt: new Date(query.year + 1, 0, 1),
      };
    }

    if (query.status) {
      whereCondition.status = query.status;
    }

    const reminders = await this.prisma.reminders.findMany({
      where: whereCondition,
      include: {
        user: true,
      },
    });

    const count = await this.prisma.reminders.count({
      where: whereCondition,
    });

    return {
      reminders,
      count,
    };
  }

  async findOne(id: number): Promise<{}> {
    return await this.prisma.reminders.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
  }

  async update(id: number, data: UpdateReminderDto) {
    return await this.prisma.reminders.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.reminders.delete({
      where: {
        id,
      },
    });
  }
}
