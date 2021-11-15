import React, { useState } from "react";

import { Modal, Card, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { hexToRgb } from "../../util";

import "./blockContent.scss";

export interface IBlockContentProps {
  color: any;
  name: string;
  help_text: string;
  has_alert: boolean;
  icon?: any;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  width?: string;
  minWidth?: string;
  height?: string;
  showColorBlock?: boolean;
}

const whiteColor = {
  r: 255,
  g: 255,
  b: 255,
};

export default function BlockContent(props: IBlockContentProps) {
  const [helpVisible, setHelpVisible] = useState(false);
  const darkRGB = props.color ? hexToRgb(props.color.dark) : whiteColor;
  const lightRGB = props.color ? hexToRgb(props.color.light) : whiteColor;

  return (
    <div style={props.style}>
      <Card
        style={{
          width: props.width ?? "17em",
          minWidth: props.minWidth ?? "220px",
          height: props.height ?? "10em",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div className="MetricDisplay--top">
          {props.showColorBlock === true ||
            (props.showColorBlock === undefined && (
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
                {props.icon && (
                  <FontAwesomeIcon icon={props.icon} className="fa-icon" />
                )}
              </div>
            ))}

          <p
            style={{
              position: "absolute",
              right: "15px",
              top: "5px",
              width: "40%",
            }}
          >
            <strong>{props.name}</strong>
          </p>
        </div>
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
            onOk={() => setHelpVisible(false)}
          >
            {props.help_text}
          </Modal>
        </div>
      )}
    </div>
  );
}
