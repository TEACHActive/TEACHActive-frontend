import React, { ReactNode } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import {
  IMetricTypeDisplayable,
  SessionMetricType,
  TREND,
} from "./metricDisplay.types";
import { MetricDisplayPresentational } from "./metricDisplayPresentational";

type TrendKeys = keyof typeof TREND;
type TrendValues = typeof TREND[TrendKeys];

export interface IMetricDisplayProps<T extends IMetricTypeDisplayable> {
  unit?: string;
  metric: T;
  canEdit: boolean;
  trend?: TrendValues;
  denominator?: number;
  metricPrepend?: string;
  trend_metric?: number;
  trend_metric_unit?: string;
  metricType: SessionMetricType;
  updateMetric?: (newMetric: number) => Promise<boolean>;
  loading: boolean;
  isError: boolean;
  children?: ReactNode;
}

export default function MetricDisplay<T extends IMetricTypeDisplayable>(
  props: IMetricDisplayProps<T>
) {
  const [newMetric, setNewMetric] = React.useState("");
  const [processing, setProcessing] = React.useState(false);
  const [editingMetric, setEditingMetric] = React.useState(false);

  let icon: IconProp | undefined = undefined;

  if (props.trend) {
    if (props.trend === 0) {
      icon = "grip-lines";
    } else if (props.trend > 0) {
      icon = "arrow-up";
    } else if (props.trend < 0) {
      icon = "arrow-down";
    }
  }
  // return <></>;
  return (
    <MetricDisplayPresentational<T>
      unit={props.unit}
      icon={icon}
      metric={props.metric}
      canEdit={props.canEdit}
      processing={false}
      denominator={props.denominator}
      trend_metric={props.trend_metric}
      metricPrepend={props.metricPrepend}
      trend_metric_unit={props.trend_metric_unit}
      updateMetric={props.updateMetric}
      setProcessing={setProcessing}
      setNewMetric={setNewMetric}
      editingMetric={editingMetric}
      setEditingMetric={setEditingMetric}
      loading={props.loading}
      isError={props.isError}
    />
  );
}
