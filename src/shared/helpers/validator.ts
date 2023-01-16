import * as Joi from 'joi';
import { InvalidIdError } from '../../domain/errors/domain-errors';
import { Either, left, right } from './either';
import { DomainError } from './errors';

type OrUndefined<T> = (T | undefined)[];

// add a parameter here to validate
// to handle different parameters in different contexts, add a parameter in the following format: ${parameter}${Context}
// eg: validate if email is from organization @mediato.dev:

// interface ValidatorParams {
// ...
//   emailFromOrganization?: string;
// }

// ...
// emailFromOrganization: Joi.string()
//         .email()
//         .regex(pattern)
//         .error(() => new InvalidEmailError()),

interface ValidatorParams {
  id?: OrUndefined<string>;
}

export class Validator {
  static validate(input: ValidatorParams): Either<DomainError, boolean> {
    const schema = Joi.object<ValidatorParams, true>({
      id: Joi.array()
        .sparse()
        .items(
          Joi.string()
            .uuid()
            .error(() => new InvalidIdError()),
        ),
      // add rules for each parameter in ValidatorParams
    });

    const validation = schema.validate({ ...input });
    if (validation.error) return left(validation.error);
    return right(true);
  }
}
