import Cookies from "universal-cookie";
import { Cookie, UsedCookies } from "constants/cookies";

export class CookieSingleton {
  private static instance: CookieSingleton;
  cookies: Cookies;

  private constructor() {
    this.cookies = new Cookies();
  }

  public static getInstance(): CookieSingleton {
    if (!CookieSingleton.instance) {
      CookieSingleton.instance = new CookieSingleton();
    }

    return CookieSingleton.instance;
  }

  public setCookie(cookie: Cookie, value: string) {
    this.cookies.set(cookie, value, {
      path: "/",
      sameSite: "strict",
    });
  }

  public getCookie(cookie: Cookie): string {
    return this.cookies.get(cookie);
  }

  public clearCookies() {
    UsedCookies.forEach((cookie) => this.cookies.remove("cookie"));
  }
}
