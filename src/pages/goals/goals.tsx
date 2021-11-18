import { useSelector } from "react-redux";

import { selectSelectedSession } from "redux/sessionSlice";
import GoalsPagePresentational from "./goalsPresentational";
import {
  // useCreateReflectionForSessionMutation,
  useGetReflectionForSessionUpsertMutation,
} from "api/services/reflections";
import { SelectASession } from "components/Session/selectASession";

export interface IGoalsPageProps {}

export function GoalsPage(props: IGoalsPageProps) {
  const selectedSession = useSelector(selectSelectedSession);

  const [
    getReflectionsForSession,
    getReflectionsForSessionResult,
  ] = useGetReflectionForSessionUpsertMutation();

  // const reflectionRequest = useGetReflectionForSessionUpsertMutation(
  //   selectedSession?.id ?? skipToken
  // );

  // const [
  //   createReflectionForSession,
  //   createReflectionForSessionResult,
  // ] = useCreateReflectionForSessionMutation();

  // const speechTotalsInSecondsForSessionRequest = useGetSpeechTotalsInSecondsQuery(
  //   selectedSession?.id
  //     ? { sessionId: selectedSession?.id, minSpeakingAmp: 0 }
  //     : skipToken
  // );

  if (!selectedSession) {
    return <SelectASession />;
  }

  return (
    <GoalsPagePresentational
      getReflectionsForSession={getReflectionsForSession}
      getReflectionsForSessionResult={getReflectionsForSessionResult}
      sessionId={selectedSession.id}
      // createReflectionForSession={createReflectionForSession}
    />
  );
}
