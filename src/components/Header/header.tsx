import * as React from "react";
import { Layout, TreeSelect } from "antd";
import { useSelector, useDispatch } from "react-redux";

import { Session } from "../../pages/metric/metricPage.types";
import { SessionTreeNodeTitle } from "./sessionTreeNodeTitle";
import { IMetricPageAPIHandler } from "../../pages/metric/metricPage.handler";
import * as ReducerActionType from "../../redux/actionTypes";

const { Header: AntHeader } = Layout;

export interface IHeaderProps {
  history: any;
  sessions: Session[];
  apiHandler: IMetricPageAPIHandler;
  refreshSessions: () => Promise<void>;
  // updateSelectedSession: (sesssion: Session | null) => void;
  // selectedSession: Session | null;
}

export function Header(props: IHeaderProps) {
  //   const [selectedSession, setSelectedSession] = React.useState();
  const selectedSession = useSelector((state: any) => state.selectedSession);
  const dispatch = useDispatch();

  async function setSessionName(session: Session, newName: string) {
    const response = await props.apiHandler.setSessionName(session, newName);
    // console.log(response);

    await props.refreshSessions();
    //Todo
    // setEditingSessionIndexBool(new Array(allSessions.length).fill(false));
  }

  const sessionTreeData: any[] = [];
  props.sessions.forEach((session: Session, i: number) => {
    let matchingIndexYear = sessionTreeData.findIndex(
      (yearLevel: any) => yearLevel.title === session.createdAt.year
    );
    if (matchingIndexYear === -1) {
      //Insert a new year into list
      matchingIndexYear =
        sessionTreeData.push({
          title: session.createdAt.year,
          value: session.createdAt.year,
          key: session.createdAt.year,
          selectable: false,
          children: [],
        }) - 1;
    }
    let matchingIndexMonth = sessionTreeData[
      matchingIndexYear
    ].children.findIndex(
      (monthLevel: any) => monthLevel.title === session.createdAt.monthLong
    );
    if (matchingIndexMonth === -1) {
      //Insert a new month into list of children of correct year
      matchingIndexMonth =
        sessionTreeData[matchingIndexYear].children.push({
          title: session.createdAt.monthLong,
          value: session.createdAt.monthLong,
          key: session.createdAt.monthLong,
          selectable: false,
          children: [],
        }) - 1;
    }

    const sessionNameOrDate =
      session.name ?? session.createdAt.toLocaleString();
    sessionTreeData[matchingIndexYear].children[
      matchingIndexMonth
    ].children.push({
      title: (
        <SessionTreeNodeTitle
          session={session}
          sessionNameOrDate={sessionNameOrDate}
          setSessionName={setSessionName}
        />
      ),
      value: session,
      selectable: true,
      session: session,
    });
  });

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
        <TreeSelect
          style={{ width: "15em", margin: "1em" }}
          value={selectedSession}
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
          treeData={sessionTreeData}
          allowClear
          treeDefaultExpandAll={true}
          showSearch
          placeholder="Please select"
          onChange={(value) => {
            dispatch({
              type: ReducerActionType.SET_SELECTED_SESSION,
              payload: { selectedSession: value },
            });
          }}
        />
      </h1>
    </AntHeader>
  );
}
