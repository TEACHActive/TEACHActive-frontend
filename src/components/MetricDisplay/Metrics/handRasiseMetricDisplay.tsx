import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import MetricDisplay from "../metricDisplay";
import { selectSelectedSession } from "redux/sessionSlice";
import BlockContent from "components/BlockContent/blockContent";
import { MetricNumberType, SessionMetricType } from "../metricDisplay.types";
import { _useGetArmPoseTotalsInSecondsSessionQuery } from "api/services/armPose";

export interface IHandRaiseMetricDisplayProps {
  sessionId?: string;
}

export function HandRaiseMetricDisplay(props: IHandRaiseMetricDisplayProps) {
  const {
    data,
    isError,
    isFetching,
    isLoading,
    // isSuccess,
  } = _useGetArmPoseTotalsInSecondsSessionQuery(props.sessionId ?? skipToken);

  return (
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
      <MetricDisplay<MetricNumberType>
        metric={new MetricNumberType(data?.handsRaised)}
        canEdit={false}
        trend={undefined}
        metricPrepend={""}
        unit="seconds"
        trend_metric={undefined}
        metricType={SessionMetricType.HandRaises}
        loading={isFetching || isLoading}
        isError={isError}
      ></MetricDisplay>
    </BlockContent>
  );
}
