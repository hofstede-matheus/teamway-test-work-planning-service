import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Shift } from './_shared';

export class CreateShiftRequest {
  @ApiProperty({
    example: 'bc7e1f21-4f06-48ad-a9b4-f6bd0e6973b9',
  })
  workerId: string;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
  })
  shiftStart: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
  })
  shiftEnd: Date;
}

export class CreateShiftResponse extends OmitType(Shift, ['worker'] as const) {}
