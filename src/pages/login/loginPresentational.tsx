import { Form, Input, Button, Typography, Checkbox } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

import { ILoginValues } from "./login";
import { Cookie, CookieSingleton } from "cookies";

import LogoSmall from "images/LogoSmall.png";

import "./login.css";

const { Title } = Typography;

export interface ILoginPagePresentationalProps {
  onFinish: (values: ILoginValues) => void;
  onFinishFailed: (errorInfo: any) => void;
}

export function LoginPagePresentational(props: ILoginPagePresentationalProps) {
  return (
    <div className="loginPage">
      <div className="loginPageLeft">
        <img className="leftLogoSmall" src={LogoSmall} alt="TEACHActive Logo" />
      </div>
      <div className="loginPageRight">
        <Form<ILoginValues>
          initialValues={{
            remember: true,
            email: CookieSingleton.getInstance().getCookie(Cookie.EMAIL),
          }}
          onFinish={props.onFinish}
          onFinishFailed={props.onFinishFailed}
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
          <Form.Item
            wrapperCol={{ offset: 8, span: 32 }}
            name="remember"
            valuePropName="checked"
          >
            <Checkbox>Remember Me</Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 0, span: 32 }}>
            <Button className="loginButton" type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
          {/* <Form.Item wrapperCol={{ offset: 0, span: 32 }}>
            <Button type="link">Forgot password?</Button>
          </Form.Item> */}
        </Form>
      </div>
    </div>
  );
}
