import { Button, Card, Modal } from "antd";
import * as React from "react";

import "./infoCard.scss";

export interface IInfoCardProps {
  color: {
    light: string;
    dark: string;
  };
  title: string;
  helpWindowContent: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function InfoCard(props: IInfoCardProps) {
  const [helpVisible, setHelpVisible] = React.useState(false);
  return (
    <>
      <Card className="InfoCard--card" style={props.style}>
        <p className="InfoCard--title">
          <strong>{props.title}</strong>
        </p>
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
            {props.helpWindowContent}
          </Modal>
        </div>
      )}
    </>
  );
}
