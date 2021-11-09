import { HomeRoute } from "routes";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";

export interface IError404Props {}

export function Error404Page(props: IError404Props) {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Link to={HomeRoute.link()}>
          <Button type="primary">Back Home</Button>
        </Link>
      }
    />
  );
}
