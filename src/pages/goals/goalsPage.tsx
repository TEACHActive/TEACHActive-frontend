import * as React from "react";

import { Empty, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { BaseSession } from "api/types";
import { getReflections } from "redux/selectors";
import GoalsPagePresentational from "./goalsPagePresentational";

import "./goalsPage.css";
import { RootState } from "redux/store";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import apiHandler from "api/handler";

export interface IGoalsPageProps {}

export default function GoalsPage(props: IGoalsPageProps) {
  const selectedSession: BaseSession | null = useSelector(
    (state: RootState) => state.session.selectedSession
  );
  // const reflections = useSelector((store: RootState) => getReflections(store));

  const dispatch = useDispatch();

  if (!selectedSession) return <Empty />;

  return (
    <FirebaseAuthConsumer>
      {({
        isSignedIn,
        user,
      }: {
        isSignedIn: boolean;
        user: firebase.default.User;
      }) => <GoalsPagePresentational session={selectedSession} user={user} />}
    </FirebaseAuthConsumer>
  );
}
