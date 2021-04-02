import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { TREND } from "../../constants/constants";

import "./metricDisplay.css";
import { SessionMetricType } from "../../pages/metric/metricPage.types";

// type ColorKeys = keyof typeof COLOR;
// type ColorValues = typeof COLOR[ColorKeys];

type TrendKeys = keyof typeof TREND;
type TrendValues = typeof TREND[TrendKeys];

export interface IMetricDisplayProps {
  metricType: SessionMetricType;
  metric: number;
  denominator: number;
  hasDenominator: boolean;
  unit?: string;
  trend: TrendValues;
  trend_metric: number;
  trend_metric_unit: string;
}

export default function MetricDisplay(props: IMetricDisplayProps) {
  console.log(props);
  
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
        <h1 className="metric-text">{props.metric}</h1>
        {props.hasDenominator && <span>/ {props.denominator}</span>}
        <span>{props.unit}</span>
        <FontAwesomeIcon
          style={{ color: "blue" }}
          size="2x"
          icon={props.trend ? "arrow-down" : "arrow-up"}
        />
        <span>
          {props.trend_metric} {props.trend_metric_unit}
        </span>
      </div>
    </div>
  );
}
