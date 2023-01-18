import { ApiProperty } from '@nestjs/swagger';

export class Worker {
  @ApiProperty({
    example: 'bc7e1f21-4f06-48ad-a9b4-f6bd0e6973b9',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class Shift {
  @ApiProperty({
    example: 'bc7e1f21-4f06-48ad-a9b4-f6bd0e6973b9',
  })
  id: string;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
  })
  workDay: Date;

  @ApiProperty({
    example: 'FIRST || SECOND || THIRD',
  })
  shiftSlot: string;

  @ApiProperty({ type: Worker })
  worker: Worker;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class WorkDay {
  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
  })
  date: Date;

  @ApiProperty({ type: Shift })
  shifts: Shift[];
}
