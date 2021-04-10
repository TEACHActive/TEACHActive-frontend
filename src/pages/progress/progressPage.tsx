import * as React from "react";
import { useSelector } from "react-redux";
import { Empty } from "antd";

import { ProgressPagePresentational } from "./progressPagePresentational";

import "./progressPage.css";
import { BaseSession } from "../../api/types";

export interface IProgressPageProps {}

export default function ProgressPage(props: IProgressPageProps) {
  const selectedSession: BaseSession | null = useSelector(
    (state: any) => state.session.selectedSession
  );

  if (!selectedSession) return <Empty />;

  return <ProgressPagePresentational session={selectedSession} />;
}
