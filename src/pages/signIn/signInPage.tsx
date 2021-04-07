import { Form, Input, Checkbox, Button, Spin, message } from "antd";
import * as React from "react";
import Cookies from "universal-cookie";
import { useHistory } from "react-router-dom";
import { loginWithEmailAndPassword } from "../../firebase/auth";
import * as routes from "../../routes";
import { IAPIHandler, APIHandler } from "../../api/handler";
import { BaseSession } from "../../api/types";
import * as ReducerActionType from "../../redux/actionTypes";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/selectors";

export interface ISignInPageProps {
  apiHandler: IAPIHandler;
}

interface ILoginValues {
  password: string;
  remember: boolean;
  email: string;
}

export default function SignInPage(props: ISignInPageProps) {
  const [cookies, setCookies] = React.useState<Cookies | null>(null);

  const history = useHistory();
  const dispatch = useDispatch();
  const userUID: string = useSelector((store: any) => getUser(store));

  React.useEffect(() => {
    setCookies(new Cookies());
  }, []);

  const initSessions = async (uid: string) => {
    const sessions: BaseSession[] = await props.apiHandler.getSessionsByUID(
      uid
    );
    console.log(sessions);

    dispatch({
      type: ReducerActionType.SET_SESSIONS,
      payload: { sessions: sessions },
    });
    const videoFrames = await props.apiHandler.getFramesBySessionID(
      sessions[0].id,
      "student"
    );
  };

  const onFinish = async (values: ILoginValues) => {
    if (values.remember) rememberEmail(values.email);
    const user = await loginWithEmailAndPassword(values.email, values.password);
    if (user) {
      history.push(routes.BaseRoute.link());
      console.log(user.uid);

      dispatch({
        action: ReducerActionType.SET_USER_UID,
        payload: { uid: user.uid },
      });
      initSessions(userUID); //user.uid
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
    if (cookies) cookies.set("email", email, { path: "/", sameSite: "strict" });
  };

  if (!cookies) return <Spin />;

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
        initialValues={{ remember: true, email: cookies.get("email") }}
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
