export class UpdateWorkerRequest {
  name?: string;
}

export class UpdateWorkerResponse {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
