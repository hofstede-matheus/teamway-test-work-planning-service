export class CreateShiftRequest {
  workerId: string;
  shiftStart: Date;
  shiftEnd: Date;
}

export class CreateShiftResponse {
  readonly id: string;

  readonly workDay: Date;
  readonly shiftSlot: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}
