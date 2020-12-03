import * as React from "react";
import COLOR from "../../constants/colors";
import { TREND } from "../../constants/constants";
import MetricDisplay from "../MetricDisplay/metricDisplay";
import SessionJSON from "../../data/session.json";

export interface IMetricLayoutProps {}

export function MetricLayout(props: IMetricLayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {SessionJSON.sessions[0].data.metrics.map((item: any, i: number) => (
        <MetricDisplay
          icon={item.icon}
          color={item.color}
          name={item.name}
          metric={item.metric}
          unit={item.unit}
          trend={item.trend}
          trend_metric={item.trend_metric}
          trend_metric_unit={item.trend_metric_unit}
          help_text={item.help_text}
          has_alert={item.has_alert}
        />
      ))}
    </div>
  );
}
