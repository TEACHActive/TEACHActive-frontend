import { Empty } from "antd";
import * as React from "react";
import { BaseSession } from "../../api/types";
import { BehavioralEngagementProgress } from "../../components/BehavioralEngagementProgress/BehavorialEngagementProgress";

import BlockContent from "../../components/BlockContent/blockContent";

import "./progressPage.css";

export interface IProgressPagePresentationalProps {
  session: BaseSession | null;
}

export function ProgressPagePresentational(
  props: IProgressPagePresentationalProps
) {
  if (!props.session) {
    return <Empty />;
  }
  const color = {
    dark: "#ededed",
    light: "#dedede",
  };

  const blockProperties = [
    // {
    //   color: color,
    //   name: "In-Class Activity",
    //   help_text: "",
    //   has_alert: false,
    //   icon: null,
    // },
    {
      color: color,
      name: "Behavorial Engagement",
      help_text: "",
      has_alert: false,
      icon: null,
      content: <BehavioralEngagementProgress />,
    },
  ];

  return (
    <div className="progressBlocksContent">
      {blockProperties.map((block) => (
        <BlockContent
          color={block.color}
          name={block.name}
          help_text={block.help_text}
          has_alert={block.has_alert}
          icon={block.icon}
          style={{ margin: "2em", width: "100%" }}
          width="100%"
        >
          {block.content}
        </BlockContent>
      ))}
    </div>
  );
}
