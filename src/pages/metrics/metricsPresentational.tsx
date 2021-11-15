import { Spin } from "antd";

import { Response } from "api/types";
import { Session } from "api/services/sessions/types";
import { ArmPoseStats, ArmPoseTotalsStats } from "api/services/armPose/types";

import "./metrics.scss";
import MetricDisplay from "components/MetricDisplay/metricDisplay";
import { SessionMetricType } from "components/MetricDisplay/metricDisplay.types";
import BlockContent from "components/BlockContent/blockContent";

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

  return <div>{handRaiseMetric}</div>;
}
