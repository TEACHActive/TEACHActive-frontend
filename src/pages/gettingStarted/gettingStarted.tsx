import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

import * as routes from "../../routes";

export interface IGettingStartedProps {}

export default function GettingStarted(props: IGettingStartedProps) {
  return (
    <div>
      <h1>Welcome to TEACHActive</h1>
      <p>Get started by ...</p>
      <Link to={routes.MetricsRoute.link()}>Go to Metrics Page</Link>
    </div>
  );
}
