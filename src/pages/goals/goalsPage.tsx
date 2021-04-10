import { Empty } from "antd";
import * as React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { BaseSession } from "../../api/types";
// import { Session } from "../metric/metricPage.types";

import "./goalsPage.css";
import GoalsPagePresentational from "./goalsPagePresentational";

export interface IGoalsPageProps {}

export default function GoalsPage(props: IGoalsPageProps) {
  const history = useHistory();

  const selectedSession: BaseSession | null = useSelector(
    (state: any) => state.session.selectedSession
  );

  if (!selectedSession) return <Empty />;

  return <GoalsPagePresentational session={selectedSession} />;
}
