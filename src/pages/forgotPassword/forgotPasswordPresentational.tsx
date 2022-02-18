import { Link } from "react-router-dom";
import { Form, Input, Button, Typography } from "antd";

import * as Route from "routes";
import { IForgotPasswordValues } from "./forgotPassword";

import LogoSmall from "images/LogoSmall.png";

import "./forgotPassword.css";

const { Title } = Typography;

export interface IForgotPasswordPagePresentationalProps {
  onFinish: (values: IForgotPasswordValues) => void;
  onFinishFailed: (errorInfo: any) => void;
  sendingPasswordReset: boolean;
}

export function ForgotPasswordPagePresentational(
  props: IForgotPasswordPagePresentationalProps
) {
  return (
    <div className="forgotPasswordPage">
      <div className="forgotPasswordPageLeft">
        <img className="leftLogoSmall" src={LogoSmall} alt="TEACHActive Logo" />
      </div>
      <div className="forgotPasswordPageRight">
        <Form<IForgotPasswordValues>
          onFinish={props.onFinish}
          onFinishFailed={props.onFinishFailed}
          size="large"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 32 }}
          layout="vertical"
        >
          <Title>Forgot Password </Title>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Confirm Email"
            name="confirmEmail"
            rules={[
              { required: true, message: "Please input your email again" },
            ]}
          >
            <Input placeholder="Confirm your email" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 0, span: 32 }}>
            <Button
              className="forgotPasswordButton"
              type="primary"
              htmlType="submit"
              loading={props.sendingPasswordReset}
            >
              Send Password Reset
            </Button>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 0, span: 32 }}>
            <Link to={Route.LogInRoute.link()}>
              <Button type="link">Return to login</Button>
            </Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
