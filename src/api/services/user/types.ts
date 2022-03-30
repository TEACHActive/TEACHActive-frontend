export class User {
  name: string;
  uid: string;
  email: string;
  isAdmin: boolean;

  constructor(data: any) {
    this.name = data.name;
    this.uid = data.uid;
    this.email = data.email;
    this.isAdmin = data.isAdmin;
  }
}

export interface TokenResponse {
  token: string;
  expiresInSeconds: number;
}
