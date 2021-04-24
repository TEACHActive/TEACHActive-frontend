import * as React from "react";

import { useHistory } from "react-router-dom";
import { Form, Input, Checkbox, Button, message } from "antd";

import * as Routes from "routes";
import { IAPIHandler } from "api/handler";
import { Cookie } from "constants/cookies";
import { CookieSingleton } from "types/cookies.types";
import { loginWithEmailAndPassword } from "firebase/authController";

export interface ISignInPageProps {
  apiHandler: IAPIHandler;
}

interface ILoginValues {
  password: string;
  remember: boolean;
  email: string;
}

export default function SignInPage(props: ISignInPageProps) {
  const history = useHistory();

  const onFinish = async (values: ILoginValues) => {
    if (values.remember) rememberEmail(values.email);
    const user = await loginWithEmailAndPassword(values.email, values.password);
    if (user) {
      history.push(Routes.BaseRoute.link());
    } else {
      message.error("Failed to log in, check email and password");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const rememberEmail = (email: string) => {
    CookieSingleton.getInstance().setCookie(Cookie.EMAIL, email);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Login</h1>

      <Form<ILoginValues>
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
          email: CookieSingleton.getInstance().getCookie(Cookie.EMAIL),
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
