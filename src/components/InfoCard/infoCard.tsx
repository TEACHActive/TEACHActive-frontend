import { Card } from "antd";
import * as React from "react";
import { hexToRgb } from "../../util";

import "./infoCard.css";

export interface IInfoCardProps {
  color: {
    light: string;
    dark: string;
  };
  icon: string;
  title: string;
  helpWindowText: string; //Maybe make this a whole react node?
  children?: React.ReactNode;
}

const whiteColor = {
  r: 255,
  g: 255,
  b: 255,
};

export function InfoCard(props: IInfoCardProps) {
  const darkRGB = props.color ? hexToRgb(props.color.dark) : whiteColor;
  const lightRGB = props.color ? hexToRgb(props.color.light) : whiteColor;
  return (
    <Card className="InfoCard--card">
      <div className="InfoCard--top">
        <div
          className="InfoCard--iconbox"
          style={{
            background: `linear-gradient(\
              45deg,\
              rgba(${darkRGB?.r}, ${darkRGB?.g}, ${darkRGB?.b}, 1) 0%,\
              rgba(${lightRGB?.r}, ${lightRGB?.g}, ${lightRGB?.b}, 1) 100%\
          )`,
          }}
        >
          {props.icon}
        </div>
        <p className="InfoCard--title"><strong>{props.title}</strong></p>
      </div>
      {props.children}
    </Card>
  );
}
