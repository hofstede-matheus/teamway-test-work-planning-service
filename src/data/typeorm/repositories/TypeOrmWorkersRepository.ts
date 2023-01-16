import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkerEntity } from '../../../domain/entities/Worker.entity';
import { WorkerRepository } from '../../../domain/repositories/WorkerRepository';
import { Worker } from '../entities/Worker';

export class TypeOrmWorkersRepository implements WorkerRepository {
  constructor(
    @InjectRepository(Worker)
    private readonly workersRepository: Repository<Worker>,
  ) {}

  async create(name: string): Promise<WorkerEntity> {
    const worker = this.workersRepository.create({ name });

    const userInDatabase = await this.workersRepository.save(worker);
    return {
      id: userInDatabase.id,
      name: userInDatabase.name,
      createdAt: userInDatabase.createdAt,
      updatedAt: userInDatabase.updatedAt,
    };
  }
}
