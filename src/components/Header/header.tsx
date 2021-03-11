import * as React from "react";
import { Layout, Button } from "antd";
import { useOktaAuth } from "@okta/okta-react";
import { useHistory } from "react-router-dom";

import { Session } from "../../pages/metric/metricPage.types";
import { IMetricPageAPIHandler } from "../../pages/metric/metricPage.handler";
import SessionSelect from "../SessionSelect/sessionSelect";

const { Header: AntHeader } = Layout;

export interface IHeaderProps {
  history: any;
  sessions: Session[];
  apiHandler: IMetricPageAPIHandler;
  refreshSessions: () => Promise<void>;
}

export function Header(props: IHeaderProps) {
  const history = useHistory();
  const { oktaAuth, authState } = useOktaAuth();

  console.log(oktaAuth, authState);

  const login = async () => history.push("/login");

  const logout = async () => oktaAuth.signOut();

  const button = authState.isAuthenticated ? (
    <Button danger type="default" onClick={logout}>
      Logout
    </Button>
  ) : (
    <Button type="primary" onClick={login}>
      Login
    </Button>
  );

  if (authState.isPending) return null;

  return (
    <AntHeader
      className="site-layout-sub-header-background"
      style={{
        paddingLeft: "1em",
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <h1
        style={{
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* {props.history.location.pathname.split("/").pop()} */}
        <SessionSelect
          sessions={props.sessions}
          apiHandler={props.apiHandler}
          refreshSessions={props.refreshSessions}
        />
      </h1>
      <div>{button}</div>
    </AntHeader>
  );
}
