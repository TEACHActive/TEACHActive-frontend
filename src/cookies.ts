import Cookies from "universal-cookie";

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

  public setCookie(cookie: Cookie, value: any) {
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

export enum Cookie {
  APP_VERSION = "APP_VERSION",
  EMAIL = "email",
  SIDER_COLLAPSE = "SIDER_COLLAPSE",
}

const UsedCookies = [Cookie.APP_VERSION, Cookie.EMAIL];
