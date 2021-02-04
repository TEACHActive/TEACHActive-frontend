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
  return (
    <div>
      {props.session.metrics &&
        props.session.metrics.map((item: SessionMetric, i: number) => {
          return (
            <BlockContent
              color={item.color}
              name={item.name}
              help_text={item.help_text}
              has_alert={item.has_alert}
              icon={null}
            ></BlockContent>
          );
        })}
    </div>
  );
}
