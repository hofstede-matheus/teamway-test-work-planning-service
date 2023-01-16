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

  remove(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async update(worker: Partial<WorkerEntity>): Promise<WorkerEntity> {
    await this.workersRepository.update(worker.id, worker);

    const updatedUser = await this.workersRepository.findOne({
      where: { id: worker.id },
    });
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  async findByName(name: string): Promise<WorkerEntity[]> {
    const workersFromDatabase = await this.workersRepository.query(
      `
      SELECT * FROM workers WHERE name LIKE $1
      `,
      [`${name}%`],
    );

    const mappedWorkers: WorkerEntity[] = workersFromDatabase.map((client) => {
      return {
        id: client.id,
        name: client.name,
        createdAt: client.created_at,
        updatedAt: client.updated_at,
      };
    });

    return mappedWorkers;
  }

  async findById(id: string): Promise<WorkerEntity> {
    const worker = await this.workersRepository.findOne({ where: { id } });

    return {
      id: worker.id,
      name: worker.name,
      createdAt: worker.createdAt,
      updatedAt: worker.updatedAt,
    };
  }

  async findAll(): Promise<WorkerEntity[]> {
    const workers = await this.workersRepository.find();

    return workers.map((worker) => ({
      id: worker.id,
      name: worker.name,
      createdAt: worker.createdAt,
      updatedAt: worker.updatedAt,
    }));
  }

  async create(name: string): Promise<WorkerEntity> {
    const worker = this.workersRepository.create({ name });

    const workerInDatabase = await this.workersRepository.save(worker);
    return {
      id: workerInDatabase.id,
      name: workerInDatabase.name,
      createdAt: workerInDatabase.createdAt,
      updatedAt: workerInDatabase.updatedAt,
    };
  }
}
