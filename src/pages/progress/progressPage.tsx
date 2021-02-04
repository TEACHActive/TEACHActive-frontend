import * as React from "react";
import { useSelector } from "react-redux";
import { Empty } from "antd";

import { ProgressPagePresentational } from "./progressPagePresentational";
import { Session } from "../../pages/metric/metricPage.types";

import "./progressPage.css";

export interface IProgressPageProps {}

export default function ProgressPage(props: IProgressPageProps) {
  const selectedSession: Session | null = useSelector(
    (state: any) => state.session.selectedSession
  );

  if (!selectedSession) return <Empty />;

  return <ProgressPagePresentational session={selectedSession} />;
}
