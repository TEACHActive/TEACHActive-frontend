import { Card } from "antd";
import * as React from "react";

export interface IInfoCardProps {
  bannerColor: string;
  icon: string;
  title: string;
  helpWindowText: string; //Maybe make this a whole react node?
  children?: React.ReactNode;
}

export function InfoCard(props: IInfoCardProps) {
  return (
    <Card style={{ width: "100%", margin: "1em" }}>
      <div className="MetricDisplay--top">
        <div
          style={{
            position: "absolute",
            backgroundColor: props.bannerColor,
            width: "4em",
            height: "4em",
            left: "10px",
            top: "-20%",
          }}
        >
          {props.icon}
        </div>
        <p
          style={{
            position: "absolute",
            right: "10px",
            top: "5%",
            maxWidth: "100px",
          }}
        >
          {props.title}
        </p>
      </div>
      {props.children}
    </Card>
  );
}
