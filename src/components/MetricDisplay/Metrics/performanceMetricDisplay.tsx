import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import MetricDisplay from "../metricDisplay";
import { selectSelectedSession } from "redux/sessionSlice";
import BlockContent from "components/BlockContent/blockContent";
import { useGetPerformanceForSessionQuery } from "api/services/performance";
import { MetricNumberType, SessionMetricType } from "../metricDisplay.types";

export interface IPerformanceMetricDisplayProps {}

export function PerformanceMetricDisplay(
  props: IPerformanceMetricDisplayProps
) {
  const selectedSession = useSelector(selectSelectedSession);
  const {
    data,
    isError,
    isFetching,
    isLoading,
    // isSuccess,
  } = useGetPerformanceForSessionQuery(selectedSession?.id ?? skipToken);
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
        metric={new MetricNumberType(data?.data?.performance)}
        canEdit={false} //Todo
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
