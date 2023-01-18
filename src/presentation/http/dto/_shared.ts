export class Shift {
  id: string;

  workDay: Date;
  shiftSlot: string;
  worker: Worker;

  createdAt: Date;
  updatedAt: Date;
}

export class Worker {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
