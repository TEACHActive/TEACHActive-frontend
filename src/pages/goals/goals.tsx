import { auth } from "firebase";
import { useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";

import { _useGetUserQuery } from "api/services/user";
import { selectSelectedSession } from "redux/sessionSlice";
import GoalsPagePresentational from "./goalsPresentational";
import { SelectASession } from "components/Session/selectASession";
import { _useGetReflectionForSessionUpsertMutation } from "api/services/reflections";

export interface IGoalsPageProps {}

export function GoalsPage(props: IGoalsPageProps) {
  const selectedSession = useSelector(selectSelectedSession);
  const [user] = useAuthState(auth);

  // const {
  //   getReflectionForSessionUpsert,
  //   getReflectionForSessionResult,
  // } = _useGetReflectionForSessionUpsertMutation();

  if (!selectedSession) {
    return <SelectASession />;
  }

  return (
    <GoalsPagePresentational
      // getReflectionsForSession={getReflectionForSessionUpsert}
      // getReflectionsForSessionResult={getReflectionForSessionResult}
      sessionId={selectedSession.id}
      userUID={user?.uid}
    />
  );
}
