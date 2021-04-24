import * as React from "react";

import { TreeSelect } from "antd";
import { DataNode } from "antd/lib/tree";
import { useSelector, useDispatch } from "react-redux";

import { BaseSession } from "api/types";
import * as ReducerActionType from "redux/actionTypes";
import { getSelectedSession } from "redux/selectors";

export interface ISessionSelectProps {
  sessions: BaseSession[];
  sessionTreeData: DataNode[];
}

export default function SessionSelect(props: ISessionSelectProps) {
  const dispatch = useDispatch();
  const selectedSession: BaseSession | null = useSelector(
    (store: any) => getSelectedSession(store),
    BaseSession.equal
  );

  return (
    <TreeSelect
      style={{ width: "15em", margin: "1em" }}
      value={selectedSession ? selectedSession.name : undefined}
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      treeData={props.sessionTreeData}
      allowClear
      treeDefaultExpandAll={true}
      showSearch
      placeholder="Please select"
      onChange={(value) => {
        dispatch({
          type: ReducerActionType.SET_SELECTED_SESSION_BY_ID,
          payload: { id: value },
        });
      }}
    />
  );
}
