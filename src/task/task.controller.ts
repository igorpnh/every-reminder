import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindByCompanyDto } from './dto/find-by-company.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() data: CreateTaskDto) {
    return this.taskService.create(data);
  }

  @Get(':id/company')
  findByCompany(@Param('id') id: string, @Query() query: FindByCompanyDto) {
    return this.taskService.findByCompany(+id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateTaskDto) {
    return this.taskService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Body() user_id: number) {
    return this.taskService.remove(+id, user_id);
  }
}
