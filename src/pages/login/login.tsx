import { Spin, Result } from "antd";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, useNavigate } from "react-router-dom";

import { auth } from "firebase";
import {
  logoutOfFirebase,
  loginWithEmailAndPassword,
} from "firebase/authController";
import { logger } from "logging";
import { HomeRoute } from "routes";
import { Cookie, CookieSingleton } from "cookies";
import { LoginPagePresentational } from "./loginPresentational";
import { DateTime } from "luxon";

export interface ILoginPageProps {}

export interface ILoginValues {
  password: string;
  remember: boolean;
  email: string;
}

export function LoginPage(props: ILoginPageProps) {
  const [user, loading, error] = useAuthState(auth);
  let navigate = useNavigate();

  const onFinish = async (values: ILoginValues) => {
    if (values.remember) rememberEmail(values.email);
    const tokenResponse = await loginWithEmailAndPassword(
      values.email,
      values.password
    );
    CookieSingleton.getInstance().setCookie(
      Cookie.AUTH_TOKEN,
      tokenResponse?.token
    );
    const tokenExpireDateTime = DateTime.fromJSDate(new Date()).plus({
      seconds: tokenResponse?.expiresInSeconds,
    });
    console.log("tokenExpireDateTime", tokenExpireDateTime.toISO());

    CookieSingleton.getInstance().setCookie(
      Cookie.AUTH_TOKEN_EXPIRE_DATETIME_ISO,
      tokenExpireDateTime.toISO()
    );
    if (user) {
      navigate(HomeRoute.link());
    } else {
      // logger.error("Failed to log in, check email and password");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    logger.error(errorInfo);
  };

  const rememberEmail = (email: string) => {
    CookieSingleton.getInstance().setCookie(Cookie.EMAIL, email);
  };

  if (loading) {
    return <Spin />;
  }

  if (error) {
    <Result
      status="500"
      title="Authentication Error"
      subTitle="Sorry, something went wrong. Try refreshing the page"
    />;
  }

  const token = CookieSingleton.getInstance().getCookie(Cookie.AUTH_TOKEN);

  if (user) {
    //Already logged in
    if (!token) {
      //Token expired, log user out
      logoutOfFirebase();
    }
    return <Navigate to={HomeRoute.link()} />;
  }

  return (
    <LoginPagePresentational
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    />
  );
}
