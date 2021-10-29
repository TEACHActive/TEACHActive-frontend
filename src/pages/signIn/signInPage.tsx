import * as React from "react";

import { useHistory, Link } from "react-router-dom";
import { Form, Input, Checkbox, Button, message, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

import * as Routes from "routes";
import { IAPIHandler } from "api/handler";
import { Cookie } from "constants/cookies";
import { CookieSingleton } from "types/cookies.types";
import { loginWithEmailAndPassword } from "firebase/authController";

import LogoSmall from "../../images/LogoSmall.png";

import "./signInPage.css";

const { Title } = Typography;

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

  const [showRememberMeCheckbox, setShowRememberMeCheckbox] = React.useState(
    false
  );

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

  // const layout = {
  //   labelCol: { span: 8 },
  //   wrapperCol: { span: 16 },
  // };
  // const tailLayout = {
  //   wrapperCol: { offset: 8, span: 16 },
  // };

  const rememberEmail = (email: string) => {
    CookieSingleton.getInstance().setCookie(Cookie.EMAIL, email);
  };

  return (
    <div className="loginPage">
      <div className="loginPageLeft">
        <img className="leftLogoSmall" src={LogoSmall} />
      </div>
      <div className="loginPageRight">
        <Form<ILoginValues>
          initialValues={{
            remember: true,
            email: CookieSingleton.getInstance().getCookie(Cookie.EMAIL),
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          size="large"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 32 }}
          layout="vertical"
        >
          <Title>Login </Title>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Enter your password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          {showRememberMeCheckbox && (
            <Form.Item
              wrapperCol={{ offset: 8, span: 32 }}
              name="remember"
              valuePropName="checked"
            >
              <Checkbox>Remember Me</Checkbox>
            </Form.Item>
          )}
          <Form.Item wrapperCol={{ offset: 0, span: 32 }}>
            <Link to="/home">
              <Button className="loginButton" type="primary">
                Login
              </Button>
            </Link>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 0, span: 32 }}>
            <Button type="link">Forgot password?</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
    // <div
    //   style={{
    //     display: "flex",
    //     flexDirection: "column",
    //     alignItems: "center",
    //   }}
    // >
    //   <h1>Login</h1>

    //   <Form<ILoginValues>
    //     {...layout}
    //     name="basic"
    //     initialValues={{
    //       remember: true,
    //       email: CookieSingleton.getInstance().getCookie(Cookie.EMAIL),
    //     }}
    //     onFinish={onFinish}
    //     onFinishFailed={onFinishFailed}
    //   >
    //     <Form.Item
    //       label="Email"
    //       name="email"
    //       rules={[{ required: true, message: "Please input your email!" }]}
    //     >
    //       <Input />
    //     </Form.Item>

    //     <Form.Item
    //       label="Password"
    //       name="password"
    //       rules={[{ required: true, message: "Please input your password!" }]}
    //     >
    //       <Input.Password />
    //     </Form.Item>

    //     <Form.Item {...tailLayout} name="remember" valuePropName="checked">
    //       <Checkbox>Remember me</Checkbox>
    //     </Form.Item>

    //     <Form.Item {...tailLayout}>
    //       <Button type="primary" htmlType="submit">
    //         Submit
    //       </Button>
    //     </Form.Item>
    //   </Form>
    // </div>
  );
}
