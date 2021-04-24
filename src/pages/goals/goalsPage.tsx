import * as React from "react";

import { Empty, Spin } from "antd";
import { useSelector } from "react-redux";

import { BaseSession } from "api/types";
import { getReflections } from "redux/selectors";
import GoalsPagePresentational from "./goalsPagePresentational";

import "./goalsPage.css";

export interface IGoalsPageProps {}

export default function GoalsPage(props: IGoalsPageProps) {
  const selectedSession: BaseSession | null = useSelector(
    (state: any) => state.session.selectedSession
  );
  const reflections = useSelector((store: any) => getReflections(store));

  // const dispatch = useDispatch();

  React.useEffect(() => {
    // if (!userUID || !selectedSession) return;
    // dispatch(getSetReflections(userUID, selectedSession.id));
  }, []);

  if (!selectedSession) return <Empty />;
  if (!reflections) return <Spin />;

  console.log(reflections);

  return (
    <GoalsPagePresentational
      session={selectedSession}
      reflections={reflections}
    />
  );
}
