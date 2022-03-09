import { Session } from "api/services/sessions/types";
import { CompareSessionsColumn } from "./compareSessionsColumn";

import "./compareSessions.scss";

export interface ICompareSessionsProps {
  sessions: Session[];
}

export function CompareSessions(props: ICompareSessionsProps) {
  return (
    <div>
      <h1>Comparison</h1>
      <div className="compareSessionsColumns">
        {props.sessions.map((session) => (
          <CompareSessionsColumn session={session} />
        ))}
      </div>
    </div>
  );
}
