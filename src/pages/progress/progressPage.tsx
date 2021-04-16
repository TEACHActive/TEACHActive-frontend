import * as React from "react";
import { useSelector } from "react-redux";
import { Empty } from "antd";

import { ProgressPagePresentational } from "./progressPagePresentational";

import "./progressPage.css";
import { BaseSession } from "../../api/types";
import { getSelectedSession, getSessions } from "../../redux/selectors";

export interface IProgressPageProps {}

export default function ProgressPage(props: IProgressPageProps) {
  const selectedSession: BaseSession | null = useSelector(
    (state: any) => getSelectedSession(state),
    BaseSession.equal
  );
  const sessions: BaseSession[] = useSelector((state: any) =>
    getSessions(state)
  );

  if (!selectedSession) return <Empty />;

  return (
    <ProgressPagePresentational session={selectedSession} sessions={sessions} />
  );
}
