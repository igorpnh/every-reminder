import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCompanyDto) {
    try {
      const userHaveCompany = await this.prisma.user.findUnique({
        where: { id: data.creator_id },
      });

      if (userHaveCompany && userHaveCompany.company_id) {
        throw new Error('User already has a company');
      } else {
        const company = await this.prisma.company.create({
          data: { ...data },
        });

        const hierarchyLevels = [
          { hierarchy_level: 1, hierarchy_name: 'Creator' },
          { hierarchy_level: 2, hierarchy_name: 'Manager' },
          { hierarchy_level: 3, hierarchy_name: 'User' },
        ];

        const hierarchy = await Promise.all(
          hierarchyLevels.map((level) =>
            this.prisma.companyHierarchy.create({
              data: {
                company_id: company.id,
                hierarchy_level: level.hierarchy_level,
                hierarchy_name: level.hierarchy_name,
              },
            }),
          ),
        );

        await this.prisma.user.update({
          where: { id: data.creator_id },
          data: {
            company_id: company.id,
            company_hierarchy_id: hierarchy.find((h) => h.hierarchy_level === 1)
              ?.id,
          },
        });

        return company;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.company.findUnique({
        where: {
          id,
        },
        include: {
          task: true,
          user: true,
        },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async checkUserPermission({
    company_id,
    user_id,
  }: {
    company_id: number;
    user_id: number;
  }) {
    try {
      const company = await this.prisma.company.findUnique({
        where: {
          id: company_id,
        },
        include: {
          companyHierarchy: true,
        },
      });

      if (!company) {
        throw new Error('Company not found');
      }

      const user = await this.prisma.user.findUnique({
        where: {
          id: user_id,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const userHierarchy = company.companyHierarchy.filter(
        (h) => h.id === user.company_hierarchy_id,
      )[0];

      if (userHierarchy.hierarchy_level > 2) {
        throw new Error('User not have permission');
      } else {
        return true;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async update(id: number, data: UpdateCompanyDto) {
    try {
      let havePermission = await this.checkUserPermission({
        company_id: id,
        user_id: data.user_id,
      });
      if (!havePermission) {
        return await this.prisma.company.update({
          where: {
            id,
          },
          data: {
            company_name: data.company_name,
          },
        });
      } else {
        return havePermission;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async remove(id: number, user_id: number) {
    try {
      let havePermission = await this.checkUserPermission({
        company_id: id,
        user_id,
      });

      if (!havePermission) {
        const company = await this.prisma.company.findUnique({
          where: {
            id,
          },
        });

        await this.prisma.user.updateMany({
          where: {
            company_id: company.id,
          },
          data: {
            company_id: null,
            company_hierarchy_id: null,
          },
        });

        await this.prisma.companyHierarchy.deleteMany({
          where: {
            company_id: company.id,
          },
        });

        const companyTasks = await this.prisma.task.findMany({
          where: {
            company_id: company.id,
          },
        });

        let commentTasks = [];
        for (const tasks of companyTasks) {
          const tasksData = await this.prisma.task.findUnique({
            where: {
              id: tasks.id,
            },
          });
          commentTasks.push(tasksData);

          await this.prisma.task.deleteMany({
            where: {
              id: tasks.id,
            },
          });

          await this.prisma.taskComment.deleteMany({
            where: {
              task_id: tasks.id,
            },
          });
        }

        for (const comment of commentTasks) {
          await this.prisma.taskCommentLike.deleteMany({
            where: {
              comment_id: comment.id,
            },
          });
        }
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
