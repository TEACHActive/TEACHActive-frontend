import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import MetricDisplay from "../metricDisplay";
import { selectSelectedSession } from "redux/sessionSlice";
import BlockContent from "components/BlockContent/blockContent";
import { MetricNumberType, SessionMetricType } from "../metricDisplay.types";
import { useGetArmPoseTotalsInSecondsSessionQuery } from "api/services/armPose";

export interface IHandRaiseMetricDisplayProps {}

export function HandRaiseMetricDisplay(props: IHandRaiseMetricDisplayProps) {
  const selectedSession = useSelector(selectSelectedSession);
  const {
    data,
    isError,
    isFetching,
    isLoading,
    // isSuccess,
  } = useGetArmPoseTotalsInSecondsSessionQuery(
    selectedSession?.id ?? skipToken
  );

  console.log(selectedSession);

  console.log(data);

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
        metric={new MetricNumberType(data?.data?.handsRaised)}
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
