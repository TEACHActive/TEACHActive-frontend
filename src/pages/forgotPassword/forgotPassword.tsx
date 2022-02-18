import React from "react";
import { message } from "antd";
import { sendPasswordReset } from "firebase/authController";

import { logger } from "logging";
import { validateEmail } from "../../util";
import { ForgotPasswordPagePresentational } from "./forgotPasswordPresentational";

export interface IForgotPasswordPageProps {}

export interface IForgotPasswordValues {
  password: string;
  remember: boolean;
  email: string;
  confirmEmail: string;
}

export function ForgotPasswordPage(props: IForgotPasswordPageProps) {
  const [sendingPasswordReset, setSendingPasswordReset] = React.useState(false);

  const onFinish = async (values: IForgotPasswordValues) => {
    setSendingPasswordReset(true);
    if (values.email !== values.confirmEmail) {
      message.error("Emails do not match");
      setSendingPasswordReset(false);
      return;
    }
    if (!validateEmail(values.email)) {
      message.error("Invalid Email Address");
      setSendingPasswordReset(false);
      return;
    }
    const result = await sendPasswordReset(values.email);
    message.success("Password reset sent");
    setSendingPasswordReset(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    logger.error(errorInfo);
    message.error("Failed:", errorInfo);
    setSendingPasswordReset(false);
  };

  return (
    <ForgotPasswordPagePresentational
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      sendingPasswordReset={sendingPasswordReset}
    />
  );
}
