import Joi from 'joi';
import { Either, left, right } from '../../shared/helpers/either';
import { DomainEntity, staticImplements } from '../../shared/helpers/entity';
import { DomainError } from '../../shared/helpers/errors';
import { InvalidNameError } from '../errors/domain-errors';

export interface WorkerEntity {
  readonly id: string;
  readonly name: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

@staticImplements<DomainEntity<WorkerEntity>>()
export class WorkerEntity {
  private constructor(readonly name: string) {}

  public static build(name: string): Either<DomainError, WorkerEntity> {
    const schema = Joi.object({
      name: Joi.string()
        .min(2)
        .required()
        .error(() => new InvalidNameError()),
    });

    const validation = schema.validate({
      name,
    });
    if (validation.error) return left(validation.error);

    return right(new WorkerEntity(name));
  }
}
