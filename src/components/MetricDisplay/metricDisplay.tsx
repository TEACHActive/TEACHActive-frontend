import React, { useState } from "react";
import { Modal, Card } from "antd";

import COLOR from "../../constants/colors";
import { TREND } from "../../constants/constants";

type ColorKeys = keyof typeof COLOR;
type ColorValues = typeof COLOR[ColorKeys];

type TrendKeys = keyof typeof TREND;
type TrendValues = typeof TREND[TrendKeys];

export interface IMetricDisplayProps {
  icon: any;
  color: ColorValues;
  name: string;
  metric: number;
  unit?: string;
  trend: TrendValues;
  trend_metric: number;
  trend_metric_unit: string;
  help_text: string;
  has_alert: boolean;
}

export default function MetricDisplay(props: IMetricDisplayProps) {
  const [helpVisible, setHelpVisible] = useState(false);
  return (
    <React.Fragment>
      <Card
        style={{
          width: "15em",
          height: "12em",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="MetricDisplay--top">
          <div
            style={{
              position: "absolute",
              backgroundColor: "yellow",
              width: "5em",
              height: "5em",
              left: "10px",
              top: "-20%",
            }}
          >
            {props.icon}
          </div>
          <p style={{ float: "right" }}>{props.name}</p>
        </div>
        <div className="MetricDisplay--bottom"></div>
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
        <Button onClick={() => setHelpVisible(true)}>?</Button> */}
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
