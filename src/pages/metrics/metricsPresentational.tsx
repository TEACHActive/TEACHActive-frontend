import { Spin } from "antd";

import { Response } from "api/types";
import { Session } from "api/services/sessions/types";
import { ArmPoseStats, ArmPoseTotalsStats } from "api/services/armPose/types";

import "./metrics.scss";
import MetricDisplay from "components/MetricDisplay/metricDisplay";
import { SessionMetricType } from "components/MetricDisplay/metricDisplay.types";
import BlockContent from "components/BlockContent/blockContent";
import { AttendanceStats } from "api/services/attendance/types";

export interface IMetricsPagePresentationalProps {
  session: Session;
  armPoseDataRequest: {
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    data?: Response<ArmPoseStats[]>;
  };
  armPoseTotalsInSecondsRequest: {
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    data?: Response<ArmPoseTotalsStats>;
  };
  attendanceStatsForSessionRequest: {
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    data?: Response<AttendanceStats>;
  };
}

export function MetricsPagePresentational(
  props: IMetricsPagePresentationalProps
) {
  const handRaiseMetric = (
    <BlockContent
      color={{
        dark: "#E6AE05",
        light: "#FFC107",
      }}
      name={"Hand Raises"}
      help_text={
        "The total number of seconds hand raises were detected during the class session"
      }
      has_alert={false}
      icon={"hand-paper"}
      style={{ marginTop: "2em", marginBottom: "2em" }}
    >
      <MetricDisplay
        metric={
          props.armPoseTotalsInSecondsRequest.data?.data?.handsRaised || 0
        }
        canEdit={false}
        trend={undefined}
        metricPrepend={""}
        trend_metric={undefined}
        metricType={SessionMetricType.HandRaises}
        loading={
          props.armPoseTotalsInSecondsRequest.isFetching ||
          props.armPoseTotalsInSecondsRequest.isLoading
        }
      ></MetricDisplay>
    </BlockContent>
  );

  const attendanceMetric = (
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
      <MetricDisplay
        metric={
          props.armPoseTotalsInSecondsRequest.data?.data?.handsRaised || 0
        }
        canEdit={false}
        trend={undefined}
        metricPrepend={"~"}
        trend_metric={undefined}
        metricType={SessionMetricType.Attendance}
        loading={
          props.armPoseTotalsInSecondsRequest.isFetching ||
          props.armPoseTotalsInSecondsRequest.isLoading
        }
      ></MetricDisplay>
    </BlockContent>
  );

  return (
    <div>
      {handRaiseMetric}
      {attendanceMetric}
    </div>
  );
}
