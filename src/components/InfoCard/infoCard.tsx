import { Button, Card, Modal } from "antd";
import * as React from "react";
// import { hexToRgb } from "../../util";

import "./infoCard.scss";

export interface IInfoCardProps {
  color: {
    light: string;
    dark: string;
  };
  icon: string;
  title: string;
  helpWindowText: string; //Maybe make this a whole react node?
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

// const whiteColor = {
//   r: 255,
//   g: 255,
//   b: 255,
// };

export function InfoCard(props: IInfoCardProps) {
  // const darkRGB = props.color ? hexToRgb(props.color.dark) : whiteColor;
  // const lightRGB = props.color ? hexToRgb(props.color.light) : whiteColor;
  const [helpVisible, setHelpVisible] = React.useState(false);
  return (
    <>
      <Card className="InfoCard--card" style={props.style}>
        <div className="InfoCard--top">
          {/* <div
          className="InfoCard--iconbox"
          style={{
            background: `linear-gradient(\
              45deg,\
              rgba(${darkRGB?.r}, ${darkRGB?.g}, ${darkRGB?.b}, 1) 0%,\
              rgba(${lightRGB?.r}, ${lightRGB?.g}, ${lightRGB?.b}, 1) 100%\
          )`,
          }}
        > */}
          {props.icon}
        </div>
        <p className="InfoCard--title">
          <strong>{props.title}</strong>
        </p>
        {/* </div> */}
        {props.children}
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
      </Card>
      {helpVisible && (
        <div>
          <Modal
            visible={helpVisible}
            onCancel={() => setHelpVisible(false)}
            onOk={() => setHelpVisible(false)}
          >
            {props.helpWindowText}
          </Modal>
        </div>
      )}
    </>
  );
}
