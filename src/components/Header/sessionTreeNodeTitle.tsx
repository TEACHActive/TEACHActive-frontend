import * as React from "react";

import { Input, Button, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { BaseSession } from "api/types";

export interface ISessionTreeNodeTitle {
  // setSessionName: (
  //   session: BaseSession,
  //   newSessionName: string
  // ) => Promise<void>;
  session: BaseSession;
}

export function SessionTreeNodeTitle(props: ISessionTreeNodeTitle) {
  const [editing, setEditing] = React.useState(false);
  const [newSessionName, setNewSessionName] = React.useState("");

  return editing ? (
    <div>
      <Input
        placeholder={props.session.name}
        value={newSessionName}
        onChange={(event) => setNewSessionName(event.target.value)}
        onClick={(event) => {
          event.stopPropagation();
        }}
        autoFocus
      />{" "}
      <Button
        type="primary"
        onClick={(event) => {
          event.stopPropagation();
          // props.setSessionName(props.session, newSessionName);
          setNewSessionName("");
          setEditing(false);
        }}
      >
        Save
      </Button>
    </div>
  ) : (
    <Tooltip placement="left" title={props.session.createdAt.toLocaleString()}>
      {props.session.name}{" "}
      <FontAwesomeIcon
        icon="edit"
        onClick={(event) => {
          event.stopPropagation();
          setEditing(true);
        }}
      />
    </Tooltip>
  );
}
