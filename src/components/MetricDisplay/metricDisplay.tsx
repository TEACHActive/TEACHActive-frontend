import React, { useState } from "react";
import { Modal, Card } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
          width: "12em",
          height: "10em",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div className="MetricDisplay--top">
          <div
            style={{
              position: "absolute",
              backgroundColor: props.color,
              width: "4em",
              height: "4em",
              left: "10px",
              top: "-20%",
            }}
          >
            {props.icon}
          </div>
          <p style={{ float: "right" }}>{props.name}</p>
        </div>
        <div className="MetricDisplay--bottom">
          <div style={{ display: "flex", margin: "1em" }}>
            <h3>{props.metric}</h3>
            <FontAwesomeIcon icon={props.trend ? "arrow-down" : "arrow-up"} />
          </div>
        </div>
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
