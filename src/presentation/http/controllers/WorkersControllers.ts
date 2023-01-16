import { Body, Controller, Post } from '@nestjs/common';
import { CreateWorkerUsecase } from '../../../interactors/usecases/CreateWorkerUsecase';
import { CreateWorkerRequest, CreateWorkerResponse } from '../dto/CreateWorker';
import { toPresentationError } from '../errors/errors';

@Controller('workers')
export class WorkersController {
  constructor(private readonly createWorkerUsecase: CreateWorkerUsecase) {}

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
}
