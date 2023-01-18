import { ApiProperty } from '@nestjs/swagger';
import { Worker } from './_shared';

export class CreateWorkerRequest {
  @ApiProperty({
    example: 'John Doe',
  })
  name: string;
}

export class CreateWorkerResponse extends Worker {}
