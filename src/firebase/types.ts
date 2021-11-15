export class TokenResponse {
  token: string;
  firebaseToken: string;
  expiresInSeconds: number;

  constructor(data: any) {
    this.token = data.token;
    this.firebaseToken = data.firebaseToken;
    this.expiresInSeconds = data.expiresInSeconds;
  }
}
