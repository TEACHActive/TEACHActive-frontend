import { Empty } from "antd";
import * as React from "react";

import BlockContent from "../../components/BlockContent/blockContent";
import { Session, SessionMetric } from "../metric/metricPage.types";

export interface IProgressPagePresentationalProps {
  session: Session | null;
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
  return (
    <div>
      <BlockContent
        color={color}
        name="In-Class Activity"
        help_text=""
        has_alert={false}
        icon={null}
      ></BlockContent>
      <BlockContent
        color={color}
        name="Behavorial Engagement"
        help_text=""
        has_alert={false}
        icon={null}
      ></BlockContent>
    </div>
  );
}
