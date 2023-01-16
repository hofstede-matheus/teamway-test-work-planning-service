export class CreateWorkerRequest {
  name: string;
}

export class CreateWorkerResponse {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
