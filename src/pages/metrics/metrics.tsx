import {
  useGetArmPoseDataInSessionQuery,
  useGetArmPoseTotalsInSecondsSessionQuery,
} from "api/services/armPose";
import { SelectASession } from "components/Session/selectASession";
import React from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useSelector } from "react-redux";
import { selectSelectedSession } from "redux/sessionSlice";
import { MetricsPagePresentational } from "./metricsPresentational";
import { useGetAttendanceStatsForSessionQuery } from "api/services/attendance";

export interface IMetricsPageProps {}

export function MetricsPage(props: IMetricsPageProps) {
  const selectedSession = useSelector(selectSelectedSession);

  const armPoseDataRequest = useGetArmPoseDataInSessionQuery(
    selectedSession?.id
      ? {
          sessionId: selectedSession.id,
          numSegments: 100,
        }
      : skipToken
  );

  const armPoseTotalsInSecondsRequest = useGetArmPoseTotalsInSecondsSessionQuery(
    selectedSession?.id ?? skipToken
  );

  const attendanceStatsForSessionRequest = useGetAttendanceStatsForSessionQuery(
    selectedSession?.id ?? skipToken
  );

  if (!selectedSession) {
    return <SelectASession />;
  }

  return (
    <MetricsPagePresentational
      session={selectedSession}
      armPoseDataRequest={armPoseDataRequest}
      armPoseTotalsInSecondsRequest={armPoseTotalsInSecondsRequest}
      attendanceStatsForSessionRequest={attendanceStatsForSessionRequest}
    />
  );
}
