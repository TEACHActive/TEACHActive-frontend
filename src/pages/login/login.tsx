import React from "react";
import { DateTime } from "luxon";
import { Spin, Result, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "firebase";
import { logger } from "logging";
import { validateEmail } from "../../util";
import { HomeRoute, LogoutRoute } from "routes";
import { Cookie, CookieSingleton } from "cookies";
import { LoginPagePresentational } from "./loginPresentational";
import { loginWithEmailAndPassword } from "firebase/authController";

export interface ILoginPageProps {}

export interface ILoginValues {
  password: string;
  remember: boolean;
  email: string;
}

export function LoginPage(props: ILoginPageProps) {
  const [loggingIn, setLoggingIn] = React.useState(false);
  const [user, loading, error] = useAuthState(auth);

  const navigate = useNavigate();

  const onFinish = async (values: ILoginValues) => {
    setLoggingIn(true);
    if (!validateEmail(values.email)) {
      message.error("Invalid Email Address");
      return;
    }
    if (values.remember) {
      rememberEmail(values.email);
    } else {
      forgetEmail();
    }
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

    CookieSingleton.getInstance().setCookie(
      Cookie.AUTH_TOKEN_EXPIRE_DATETIME_ISO,
      tokenExpireDateTime.toISO()
    );
    setLoggingIn(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    logger.error(errorInfo);
    setLoggingIn(false);
  };

  const rememberEmail = (email: string) => {
    CookieSingleton.getInstance().setCookie(Cookie.EMAIL, email);
  };
  const forgetEmail = () => {
    CookieSingleton.getInstance().setCookie(Cookie.EMAIL, "");
  };

  React.useEffect(() => {
    const token = CookieSingleton.getInstance().getCookie(Cookie.AUTH_TOKEN);

    if (user) {
      //Already logged in
      if (!token) {
        //Token expired, log user out
        navigate(LogoutRoute.link());
      }
      navigate(HomeRoute.link());
    }
  }, [user]);

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

  return (
    <LoginPagePresentational
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      loggingIn={loggingIn}
    />
  );
}
