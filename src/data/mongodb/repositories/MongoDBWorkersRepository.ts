import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkerEntity } from '../../../domain/entities/Worker.entity';
import { WorkerRepository } from '../../../domain/repositories/WorkerRepository';
import { WorkerDocument, WorkerMongoEntity } from '../schemas/Worker';

export class MongoDBWorkersRepository implements WorkerRepository {
  constructor(
    @InjectModel(WorkerMongoEntity.name) private workerModel: Model<WorkerDocument>,
  ) {}

  async create(name: string): Promise<WorkerEntity> {
    const worker = new this.workerModel({ name });
    const workerInDatabase = await worker.save();
    return {
      id: workerInDatabase._id.toString(),
      name: workerInDatabase.name,
      createdAt: workerInDatabase.createdAt,
      updatedAt: workerInDatabase.updatedAt,
    };
  }

  async findByName(name: string): Promise<WorkerEntity[]> {
    const workersFromDatabase = await this.workerModel.find({
      name: { $regex: `^${name}`, $options: 'i' },
    });
    const mappedWorkers: WorkerEntity[] = workersFromDatabase.map((client) => {
      return {
        id: client._id.toString(),
        name: client.name,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      };
    });

    return mappedWorkers;
  }

  async findById(id: string): Promise<WorkerEntity> {
    const workerInDatabase = await this.workerModel.findById(id);

    if (!workerInDatabase) return undefined;

    return {
      id: workerInDatabase._id.toString(),
      name: workerInDatabase.name,
      createdAt: workerInDatabase.createdAt,
      updatedAt: workerInDatabase.updatedAt,
    };
  }

  async findAll(): Promise<WorkerEntity[]> {
    const workersFromDatabase = await this.workerModel.find();
    const mappedWorkers: WorkerEntity[] = workersFromDatabase.map((worker) => {
      return {
        id: worker._id.toString(),
        name: worker.name,
        createdAt: worker.createdAt,
        updatedAt: worker.updatedAt,
      };
    });

    return mappedWorkers;
  }

  async update(worker: Partial<WorkerEntity>): Promise<WorkerEntity> {
    const updatedWorker = await this.workerModel.findByIdAndUpdate(
      { _id: worker.id },
      {
        $set: worker,
      },
      { new: true },
    );
    return {
      id: updatedWorker._id.toString(),
      name: updatedWorker.name,
      createdAt: updatedWorker.createdAt,
      updatedAt: updatedWorker.updatedAt,
    };
  }

  remove(id: string): Promise<void> {
    this.workerModel.deleteOne({ _id: id }).exec();
    return;
  }
}
