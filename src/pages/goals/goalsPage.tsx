import { useOktaAuth } from "@okta/okta-react";
import { Empty } from "antd";
import * as React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Session } from "../metric/metricPage.types";

import "./goalsPage.css";
import GoalsPagePresentational from "./goalsPagePresentational";

export interface IGoalsPageProps {}

export default function GoalsPage(props: IGoalsPageProps) {
  const reflections = [
    {
      title: "Reflection1",
      timestamp: "2021-01-20T18:27:44.117Z",
      content: "This is the first reflection",
      tags: ["tag1", "tag2"],
    },
  ];

  const history = useHistory();
  const { oktaAuth, authState } = useOktaAuth();

  const selectedSession: Session | null = useSelector(
    (state: any) => state.session.selectedSession
  );

  if (authState.isPending) return null;

  if (!selectedSession) return <Empty />;

  return (
    <GoalsPagePresentational
      session={selectedSession}
      reflections={reflections}
    />
  );
}
