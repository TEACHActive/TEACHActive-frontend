export class User {
  name: string;
  uid: string;

  constructor(data: any) {
    this.name = data.name;
    this.uid = data.uid;
  }
}

export interface TokenResponse {
  token: string;
  expiresInSeconds: number;
}
