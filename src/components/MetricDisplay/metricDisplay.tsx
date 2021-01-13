import React, { useState } from "react";
import { Modal, Card, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import COLOR from "../../constants/colors";
import { TREND } from "../../constants/constants";

import "./metricDisplay.css";
import { hexToRgb } from "../../util";
import { SessionMetricType } from "../../pages/session/sessionPage.types";

// type ColorKeys = keyof typeof COLOR;
// type ColorValues = typeof COLOR[ColorKeys];

type TrendKeys = keyof typeof TREND;
type TrendValues = typeof TREND[TrendKeys];

export interface IMetricDisplayProps {
  color: any;
  metricType: SessionMetricType;
  name: string;
  metric: number;
  denominator: number;
  hasDenominator: boolean;
  unit?: string;
  trend: TrendValues;
  trend_metric: number;
  trend_metric_unit: string;
  help_text: string;
  has_alert: boolean;
}

const whiteColor = {
  r: 255,
  g: 255,
  b: 255,
};

export default function MetricDisplay(props: IMetricDisplayProps) {
  const [helpVisible, setHelpVisible] = useState(false);
  const darkRGB = props.color ? hexToRgb(props.color.dark) : whiteColor;
  const lightRGB = props.color ? hexToRgb(props.color.light) : whiteColor;
  let icon: any = "";

  switch (props.metricType) {
    case SessionMetricType.HandRaises:
      icon = "hand-paper";
      break;
    case SessionMetricType.StudentSpeech:
      icon = "comments";
      break;
    case SessionMetricType.InstructorSpeech:
      icon = "comment";
      break;
    case SessionMetricType.ClassPerformance:
      icon = "id-card";
      break;
  }
  return (
    <React.Fragment>
      <Card
        style={{
          width: "17em",
          minWidth: "220px",
          height: "10em",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div className="MetricDisplay--top">
          <div
            className="colorBlock"
            style={{
              background: `linear-gradient(\
                45deg,\
                rgba(${darkRGB?.r}, ${darkRGB?.g}, ${darkRGB?.b}, 1) 0%,\
                rgba(${lightRGB?.r}, ${lightRGB?.g}, ${lightRGB?.b}, 1) 100%\
              )`,
            }}
          >
            <FontAwesomeIcon icon={icon} className="fa-icon" />
          </div>
          <p
            style={{
              position: "absolute",
              right: "15px",
              top: "5px",
              width: "40%",
            }}
          >
            {props.name}
          </p>
        </div>
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
        <Button
          style={{
            borderRadius: "50%",
            position: "absolute",
            top: "-10px",
            right: "-10px",
          }}
          size="small"
          onClick={() => setHelpVisible(true)}
        >
          ?
        </Button>
        {/* <div>
          <div
            style={{
              backgroundColor: `${props.color}`,
              width: "50px",
              height: "50px",
            }}
          />
        </div>
        <div></div>
         */}
      </Card>

      {helpVisible && (
        <div>
          <Modal
            visible={helpVisible}
            onCancel={() => setHelpVisible(false)}
          ></Modal>
        </div>
      )}
    </React.Fragment>
  );
}
