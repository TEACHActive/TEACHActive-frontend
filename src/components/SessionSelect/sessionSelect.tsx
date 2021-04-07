import * as React from "react";
import { TreeSelect } from "antd";
import { useSelector, useDispatch } from "react-redux";

import * as ReducerActionType from "../../redux/actionTypes";
import { SessionTreeNodeTitle } from "../Header/sessionTreeNodeTitle";
import { BaseSession } from "../../api/types";
import { IAPIHandler } from "../../api/handler";

export interface ISessionSelectProps {
  sessions: BaseSession[];
  apiHandler: IAPIHandler;
  refreshSessions: () => Promise<void>;
}

export default function SessionSelect(props: ISessionSelectProps) {
  const dispatch = useDispatch();
  const selectedSession: BaseSession | null = useSelector(
    (state: any) => state.session.selectedSession,
    BaseSession.equal
  );

  const sessionTreeData: any[] = [];

  props.sessions.forEach((session: BaseSession, i: number) => {
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

    const sessionNameOrDate = session.id ?? session.createdAt.toLocaleString();
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

  async function setSessionName(session: BaseSession, newName: string) {
    // const response = await props.apiHandler.setSessionName(session, newName);//Todo
    // await props.refreshSessions();
    //Todo
    // setEditingSessionIndexBool(new Array(allSessions.length).fill(false));
  }

  return (
    <TreeSelect
      style={{ width: "15em", margin: "1em" }}
      value={selectedSession ? selectedSession.id : undefined}
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
