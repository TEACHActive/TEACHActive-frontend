import { Spin, Result } from "antd";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, useNavigate } from "react-router-dom";

import { auth } from "firebase";
import { HomeRoute } from "routes";
import { loginWithEmailAndPassword } from "firebase/authController";

import { logger } from "logging";

import { Cookie, CookieSingleton } from "cookies";
import { LoginPagePresentational } from "./loginPresentational";

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
    const user = await loginWithEmailAndPassword(values.email, values.password);
    if (user) {
      navigate(HomeRoute.link());
    } else {
      logger.error("Failed to log in, check email and password");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    logger.error(errorInfo);
  };

  const rememberEmail = (email: string) => {
    CookieSingleton.getInstance().setCookie(Cookie.EMAIL, email);
  };

  if (error) {
    <Result
      status="500"
      title="Authentication Error"
      subTitle="Sorry, something went wrong. Try refreshing the page"
    />;
  }

  if (loading) {
    return <Spin />;
  }

  if (user) {
    //Already logged in
    return <Navigate to={HomeRoute.link()} />;
  }

  return (
    <LoginPagePresentational
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    />
  );
}
