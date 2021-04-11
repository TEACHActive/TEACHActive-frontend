import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, Button } from "antd";
import { BaseSession } from "../../api/types";
import { DateTime } from "luxon";

export interface ISessionTreeNodeTitle {
  setSessionName: (
    session: BaseSession,
    newSessionName: string
  ) => Promise<void>;
  session: BaseSession;
}

export function SessionTreeNodeTitle(props: ISessionTreeNodeTitle) {
  const [editing, setEditing] = React.useState(false);
  const [newSessionName, setNewSessionName] = React.useState("");

  const sessionName = props.session.name;

  return editing ? (
    <div>
      <Input
        placeholder={sessionName}
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
          props.setSessionName(props.session, newSessionName);
          setNewSessionName("");
          setEditing(false);
          // let items = [...editingSessionIndexBool];
          // items[i] = false;
          // setEditingSessionIndexBool(items);
        }}
      >
        Save
      </Button>
    </div>
  ) : (
    <div>
      {sessionName}{" "}
      <FontAwesomeIcon
        icon="edit"
        onClick={(event) => {
          event.stopPropagation();
          setEditing(true);
        }}
      />
    </div>
  );
}
