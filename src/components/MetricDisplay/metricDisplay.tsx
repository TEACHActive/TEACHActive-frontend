import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { TREND } from "../../constants/constants";

import "./metricDisplay.css";
import { SessionMetricType } from "../../pages/metric/metricPage.types";
import { Input, Button } from "antd";

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
  metricPrepend: string;
  canEdit: boolean;
}

export default function MetricDisplay(props: IMetricDisplayProps) {
  const [editingMetric, setEditingMetric] = React.useState(false);
  const [newMetric, setNewMetric] = React.useState("");

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
            />
            <div style={{ display: "flex" }}>
              <Button type="primary" size="small">
                <FontAwesomeIcon
                  icon="check"
                  size="1x"
                  color="blue"
                  onClick={(event) => {
                    setEditingMetric(false);
                    // props.setSessionName(props.session, newSessionName);
                    setNewMetric("");
                  }}
                />
              </Button>
              <Button type="default" size="small" danger>
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
            {props.metric}
          </h1>
        )}

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
