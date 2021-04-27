import * as React from "react";
import { useSelector } from "react-redux";
import { Empty } from "antd";

import { ProgressPagePresentational } from "./progressPagePresentational";

import "./progressPage.css";
import { BaseSession } from "../../api/types";
import { getSelectedSession, getSessions } from "../../redux/selectors";
import { RootState } from "redux/store";

export interface IProgressPageProps {}

export default function ProgressPage(props: IProgressPageProps) {
  const selectedSession: BaseSession | null = useSelector(
    (state: RootState) => getSelectedSession(state),
    BaseSession.equal
  );
  const sessions: BaseSession[] = useSelector((state: RootState) =>
    getSessions(state)
  );

  if (!selectedSession) return <Empty />;

  return (
    <ProgressPagePresentational session={selectedSession} sessions={sessions} />
  );
}
