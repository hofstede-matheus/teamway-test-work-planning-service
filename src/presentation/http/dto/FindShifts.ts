import { ApiProperty } from '@nestjs/swagger';
import { WorkDay } from './_shared';

export class FindShiftByDateResponse extends WorkDay {}

export class FindShiftByDateRangeResponse {
  @ApiProperty({ type: WorkDay })
  workDays: WorkDay[];
}
