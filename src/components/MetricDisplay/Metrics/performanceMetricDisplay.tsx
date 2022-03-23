import { skipToken } from "@reduxjs/toolkit/dist/query";

import MetricDisplay from "../metricDisplay";
import BlockContent from "components/BlockContent/blockContent";
import { _useGetPerformanceForSessionQuery } from "api/services/performance";
import { MetricNumberType, SessionMetricType } from "../metricDisplay.types";

export interface IPerformanceMetricDisplayProps {
  sessionId?: string;
}

export function PerformanceMetricDisplay(
  props: IPerformanceMetricDisplayProps
) {
  const {
    data,
    isError,
    isFetching,
    isLoading,
    // isSuccess,
  } = _useGetPerformanceForSessionQuery(props.sessionId ?? skipToken);
  return (
    <BlockContent
      color={{
        dark: "#1E7FD4",
        light: "#1E88E5",
      }}
      name="Class Performance"
      help_text="Did you do any graded activity in this class session? You may enter manually the average class performance and compare them with future sessions!"
      has_alert={false}
      icon="id-card"
      style={{ marginTop: "2em", marginBottom: "2em" }}
    >
      <MetricDisplay<MetricNumberType>
        metric={new MetricNumberType(data?.performance)}
        canEdit={false} // TODO: ?
        trend={undefined}
        unit="%"
        trend_metric={undefined}
        metricType={SessionMetricType.ClassPerformance}
        loading={isFetching || isLoading}
        isError={isError}
      ></MetricDisplay>
    </BlockContent>
  );
}
