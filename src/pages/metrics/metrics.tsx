import { useSelector } from "react-redux";

import { selectSelectedSession } from "redux/sessionSlice";
import { SelectASession } from "components/Session/selectASession";
import { MetricsPagePresentational } from "./metricsPresentational";
import { useUpdateSessionNameMutation } from "api/services/sessions/sessions";

export interface IMetricsPageProps {}

export function MetricsPage(props: IMetricsPageProps) {
  const selectedSession = useSelector(selectSelectedSession);

  const [
    updateSessionName,
    updateSessionNameResult,
  ] = useUpdateSessionNameMutation();

  // const armPoseDataRequest = useGetArmPoseDataInSessionQuery(
  //   selectedSession?.id
  //     ? {
  //         sessionId: selectedSession.id,
  //         numSegments: 100,
  //       }
  //     : skipToken
  // );

  if (!selectedSession) {
    return <SelectASession />;
  }

  return (
    <MetricsPagePresentational
      session={selectedSession}
      updateSessionName={updateSessionName} //todo get working
      updateSessionNameResult={updateSessionNameResult}
    />
  );
}
