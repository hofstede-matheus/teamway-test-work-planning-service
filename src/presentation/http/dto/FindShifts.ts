import { Shift } from './_shared';

export class FindShiftByDateResponse {
  date: Date;
  shifts: Shift[];
}

export class FindShiftByDateRangeResponse {
  workDays: FindShiftByDateResponse[];
}
