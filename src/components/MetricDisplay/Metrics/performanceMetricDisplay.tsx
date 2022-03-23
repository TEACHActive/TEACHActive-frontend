import { skipToken } from "@reduxjs/toolkit/dist/query";

import MetricDisplay from "../metricDisplay";
import BlockContent from "components/BlockContent/blockContent";
import {
  _useGetPerformanceForSessionQuery,
  _useUpdatePerformanceForSessionMutation,
} from "api/services/performance";
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
    refetch,
  } = _useGetPerformanceForSessionQuery(props.sessionId ?? skipToken);

  const {
    updatePerformanceForSession,
  } = _useUpdatePerformanceForSessionMutation();

  const updatePerformance = async (value: number): Promise<string> => {
    if (!props.sessionId) {
      // Todo add more here to explain to user why reject
      return Promise.reject("");
    }
    // const parsedValue = parseFloat(value);
    // // Validate that performance is a number
    // if (typeof value !== "number") {
    //   return Promise.reject("Value is not a number");
    // }
    // Validate that performance is between 0 - 100
    if (value < 0 || value > 100) {
      return Promise.reject("Value out of bounds for performance");
    }
    await updatePerformanceForSession({
      sessionId: props.sessionId,
      performance: value,
    });
    refetch();
    return Promise.resolve("");
  };

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
        canEdit={true}
        updateMetric={updatePerformance}
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
