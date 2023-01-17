import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateWorkerUsecase } from '../../../interactors/usecases/worker/CreateWorkerUsecase';
import { FindWorkersUsecase } from '../../../interactors/usecases/worker/FindWorkersUsecase';
import { RemoveWorkerUsecase } from '../../../interactors/usecases/worker/RemoveWorkerUsecase';
import { UpdateWorkerUsecase } from '../../../interactors/usecases/worker/UpdateWorkerUsecase';
import { CreateWorkerRequest, CreateWorkerResponse } from '../dto/CreateWorker';
import {
  FindAllWorkersResponse,
  FindWorkerByIdResponse,
} from '../dto/FindWorkers';
import { UpdateWorkerRequest, UpdateWorkerResponse } from '../dto/UpdateWorker';
import { toPresentationError } from '../errors/errors';

@Controller('workers')
export class WorkersController {
  constructor(
    private readonly createWorkerUsecase: CreateWorkerUsecase,
    private readonly findWorkersUsecase: FindWorkersUsecase,
    private readonly updateWorkerUsecase: UpdateWorkerUsecase,
    private readonly removeWorkerUsecase: RemoveWorkerUsecase,
  ) {}

  @Post()
  async createWorker(
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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateWorkerRequest,
  ): Promise<UpdateWorkerResponse> {
    const result = await this.updateWorkerUsecase.execute(id, {
      name: body.name,
    });

    if (result.isLeft()) throw toPresentationError(result.value);

    return {
      id: result.value.id,
      name: result.value.name,
      createdAt: result.value.createdAt,
      updatedAt: result.value.updatedAt,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    const result = await this.removeWorkerUsecase.execute(id);

    if (result.isLeft()) throw toPresentationError(result.value);

    return;
  }
}
