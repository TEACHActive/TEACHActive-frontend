import * as React from "react";

import { TreeSelect } from "antd";
import { DataNode } from "antd/lib/tree";
import { useSelector, useDispatch } from "react-redux";

import { BaseSession } from "api/types";
import * as ReducerActionType from "redux/actionTypes";
import { getSelectedSession } from "redux/selectors";
import { RootState } from "redux/store";

export interface ISessionSelectProps {
  sessions: BaseSession[];
  sessionTreeData: DataNode[];
}

export default function SessionSelect(props: ISessionSelectProps) {
  const dispatch = useDispatch();
  const selectedSession: BaseSession | null = useSelector(
    (store: RootState) => getSelectedSession(store),
    BaseSession.equal
  );

  return (
    <TreeSelect
      style={{ width: "15em", margin: "1em" }}
      value={selectedSession ? selectedSession.name : undefined}
      dropdownStyle={{ overflow: "auto" }}
      treeData={props.sessionTreeData}
      allowClear
      treeDefaultExpandAll={true}
      showSearch
      virtual={false}
      placeholder="Please select"
      dropdownClassName="sessionSelectDropdown"
      onChange={(value) => {
        dispatch({
          type: ReducerActionType.SET_SELECTED_SESSION_BY_ID,
          payload: { id: value },
        });
      }}
    />
  );
}
