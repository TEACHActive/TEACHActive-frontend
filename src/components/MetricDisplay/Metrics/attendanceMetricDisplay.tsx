import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import MetricDisplay from "../metricDisplay";
import { selectSelectedSession } from "redux/sessionSlice";
import BlockContent from "components/BlockContent/blockContent";
import { MetricNumberType, SessionMetricType } from "../metricDisplay.types";
import { _useGetAttendanceStatsForSessionQuery } from "api/services/attendance";

export interface IAttendanceMetricDisplayProps {
  sessionId?: string;
}

export function AttendanceMetricDisplay(props: IAttendanceMetricDisplayProps) {
  const {
    data,
    isError,
    isFetching,
    isLoading,
    // isSuccess,
  } = _useGetAttendanceStatsForSessionQuery(props.sessionId ?? skipToken);
  return (
    <BlockContent
      color={{
        dark: "#842ed1",
        light: "#9534eb",
      }}
      name="Attendence"
      help_text="Average number of students detected during the session"
      has_alert={false}
      icon={"users"}
      style={{ marginTop: "2em", marginBottom: "2em" }}
    >
      <MetricDisplay<MetricNumberType>
        metric={new MetricNumberType(data?.max)}
        canEdit={false}
        trend={undefined}
        metricPrepend={"~"}
        trend_metric={undefined}
        metricType={SessionMetricType.Attendance}
        loading={isFetching || isLoading}
        isError={isError}
      ></MetricDisplay>
    </BlockContent>
  );
}
