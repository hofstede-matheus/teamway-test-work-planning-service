import { ApiProperty } from '@nestjs/swagger';
import { Worker } from './_shared';

export class UpdateWorkerRequest {
  @ApiProperty({
    example: 'John Doe',
    required: false,
  })
  name?: string;
}

export class UpdateWorkerResponse extends Worker {}
