import * as React from "react";
import { TreeSelect } from "antd";
import { useSelector, useDispatch } from "react-redux";

import * as ReducerActionType from "../../redux/actionTypes";
import { SessionTreeNodeTitle } from "../Header/sessionTreeNodeTitle";
import { Session } from "../../pages/metric/metricPage.types";
import { IMetricPageAPIHandler } from "../../pages/metric/metricPage.handler";

export interface ISessionSelectProps {
  sessions: Session[];
  apiHandler: IMetricPageAPIHandler;
  refreshSessions: () => Promise<void>;
}

export default function SessionSelect(props: ISessionSelectProps) {
  const dispatch = useDispatch();
  const selectedSession = useSelector((state: any) => state.selectedSession);

  async function setSessionName(session: Session, newName: string) {
    const response = await props.apiHandler.setSessionName(session, newName);

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
  );
}
