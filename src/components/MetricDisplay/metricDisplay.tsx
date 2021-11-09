import React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { SessionMetricType, TREND } from "./metricDisplay.types";
import { MetricDisplayPresentational } from "./metricDisplayPresentational";

type TrendKeys = keyof typeof TREND;
type TrendValues = typeof TREND[TrendKeys];

export interface IMetricDisplayProps {
  unit?: string;
  metric: number;
  canEdit: boolean;
  trend?: TrendValues;
  denominator: number;
  metricPrepend: string;
  trend_metric?: number;
  trend_metric_unit?: string;
  metricType: SessionMetricType;
  // children: ReactNode;
  // updateMetric: (newMetric: string) => Promise<boolean>;
}

export default function MetricDisplay(props: IMetricDisplayProps) {
  const [newMetric, setNewMetric] = React.useState("");
  const [processing, setProcessing] = React.useState(false);
  const [editingMetric, setEditingMetric] = React.useState(false);

  let icon: IconProp | null = null;

  if (props.trend) {
    if (props.trend === 0) {
      icon = "grip-lines";
    } else if (props.trend > 0) {
      icon = "arrow-up";
    } else if (props.trend < 0) {
      icon = "arrow-down";
    }
  }

  return <></>;
  // return <MetricDisplayPresentational />;
}
