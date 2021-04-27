import React, { ReactNode } from "react";

import { Input, Button } from "antd";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { TREND } from "constants/constants";
import { SessionMetricType } from "pages/metric/metricPage.types";

import "./metricDisplay.css";

type TrendKeys = keyof typeof TREND;
type TrendValues = typeof TREND[TrendKeys];

export interface IMetricDisplayProps {
  metricType: SessionMetricType;
  metric: number;
  denominator: number;
  hasDenominator: boolean;
  unit?: string;
  trend?: TrendValues;
  trend_metric?: number;
  trend_metric_unit?: string;
  metricPrepend: string;
  canEdit: boolean;
  updateMetric: (newMetric: string) => Promise<boolean>;
  children: ReactNode;
}

export default function MetricDisplay(props: IMetricDisplayProps) {
  const [editingMetric, setEditingMetric] = React.useState(false);
  const [newMetric, setNewMetric] = React.useState("");
  const [processing, setProcessing] = React.useState(false);

  let icon: IconProp | null = null;

  if (props.trend) {
    if (props.trend === 0) {
      icon = "grip-lines";
    }
    if (props.trend > 0) {
      icon = "arrow-up";
    }
    if (props.trend < 0) {
      icon = "arrow-down";
    }
  }

  return (
    <div className="MetricDisplay--bottom">
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          margin: "1em",
          marginTop: "3em",
          width: "100%",
        }}
      >
        {props.canEdit && !editingMetric && (
          <FontAwesomeIcon
            icon="edit"
            size="1x"
            onClick={() => {
              setEditingMetric(true);
            }}
            className="sessionTitleEdit"
          />
        )}

        {editingMetric ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "50%",
            }}
          >
            <Input
              placeholder={props.metric.toString()}
              onChange={(event) => setNewMetric(event.target.value)}
              disabled={processing}
            />
            <div style={{ display: "flex" }}>
              <Button type="primary" size="small" disabled={processing}>
                <FontAwesomeIcon
                  icon="check"
                  size="1x"
                  color="blue"
                  onClick={async (event) => {
                    console.log(323);

                    setProcessing(true);
                    setEditingMetric(false);
                    const success = await props.updateMetric(newMetric);
                    if (success) {
                      setNewMetric("");
                    }
                    setProcessing(false);
                    console.log(32343);
                  }}
                />
              </Button>
              <Button type="default" size="small" danger disabled={processing}>
                <FontAwesomeIcon
                  icon="ban"
                  size="1x"
                  color="red"
                  onClick={(event) => {
                    setEditingMetric(false);
                    setNewMetric("");
                  }}
                />
              </Button>
            </div>
          </div>
        ) : (
          <h1 className="metric-text">
            {props.metricPrepend}
            {props.metric === undefined ? "-" : props.metric}
          </h1>
        )}

        {props.hasDenominator && <span>/ {props.denominator}</span>}

        <span>{props.unit}</span>
        {icon && (
          <FontAwesomeIcon style={{ color: "blue" }} size="2x" icon={icon} />
        )}
        <span>
          {props.trend_metric} {props.trend_metric_unit}
        </span>
      </div>
      {props.children}
    </div>
  );
}
