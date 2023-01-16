import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateWorkerUsecase } from '../../../interactors/usecases/CreateWorkerUsecase';
import { FindWorkersUsecase } from '../../../interactors/usecases/FindWorkersUsecase';
import { CreateWorkerRequest, CreateWorkerResponse } from '../dto/CreateWorker';
import {
  FindAllWorkersResponse,
  FindWorkerByIdResponse,
} from '../dto/FindWorkers';
import { toPresentationError } from '../errors/errors';

@Controller('workers')
export class WorkersController {
  constructor(
    private readonly createWorkerUsecase: CreateWorkerUsecase,
    private readonly findWorkersUsecase: FindWorkersUsecase,
  ) {}

  @Post()
  async createUser(
    @Body() body: CreateWorkerRequest,
  ): Promise<CreateWorkerResponse> {
    const result = await this.createWorkerUsecase.execute(body.name);

    if (result.isLeft()) throw toPresentationError(result.value);

    return {
      id: result.value.id,
      name: result.value.name,
      createdAt: result.value.createdAt,
      updatedAt: result.value.updatedAt,
    };
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<FindWorkerByIdResponse> {
    const result = await this.findWorkersUsecase.execute({ workerId: id });

    if (result.isLeft()) throw toPresentationError(result.value);

    return {
      id: result.value[0].id,
      name: result.value[0].name,
      createdAt: result.value[0].createdAt,
      updatedAt: result.value[0].updatedAt,
    };
  }

  @Get()
  async getAll(@Query('name') name: string): Promise<FindAllWorkersResponse[]> {
    const result = await this.findWorkersUsecase.execute({ nameQuery: name });

    if (result.isLeft()) throw toPresentationError(result.value);

    const workers: FindAllWorkersResponse[] = result.value.map((worker) => ({
      id: worker.id,
      name: worker.name,
      createdAt: worker.createdAt,
      updatedAt: worker.updatedAt,
    }));

    return workers;
  }
}
