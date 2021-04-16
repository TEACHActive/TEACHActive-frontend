import { Empty, Spin } from "antd";
import * as React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { BaseSession } from "../../api/types";
import { getReflections, getUser } from "../../redux/selectors";
import { useDispatch } from "react-redux";

import "./goalsPage.css";
import GoalsPagePresentational from "./goalsPagePresentational";
import * as ReducerActionType from "../../redux/actionTypes";
import { getSetReflections } from "../../redux/actions";

export interface IGoalsPageProps {}

export default function GoalsPage(props: IGoalsPageProps) {
  const history = useHistory();

  const selectedSession: BaseSession | null = useSelector(
    (state: any) => state.session.selectedSession
  );
  const userUID: string = useSelector((store: any) => getUser(store));
  const reflections = useSelector((store: any) => getReflections(store));

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!userUID || !selectedSession) return;
    dispatch(getSetReflections(userUID, selectedSession.id));
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
