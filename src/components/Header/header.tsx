import * as React from "react";
import { Layout } from "antd";

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
    </AntHeader>
  );
}
