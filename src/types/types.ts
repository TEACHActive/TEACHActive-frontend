export class APIResponse<T> {
  statusCode: number;
  data: T | undefined;

  constructor(data: { statusCode: number; data: T | undefined }) {
    this.statusCode = data.statusCode;
    this.data = data.data;
  }
}
