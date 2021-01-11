import * as React from "react";
import { Empty } from "antd";

import { Session } from "./sessionPage.types";
import { InfoCard } from "./InfoCard/infoCard";
import MetricDisplay from "./MetricDisplay/metricDisplay";

export interface ISessionPagePresentationalProps {
  session: Session | undefined;
}

export function SessionPagePresentational(
  props: ISessionPagePresentationalProps
) {
  if (!props.session) {
    return <Empty />;
  }
  return (
    <div>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            width: "100%",
          }}
        >
          {props.session &&
            [1, 1, 1, 1].map((item: any, i: number) => (
              <MetricDisplay
                key={i}
                icon={item.icon}
                color={item.color}
                name={item.name}
                metric={item.metric}
                unit={item.unit}
                trend={item.trend}
                trend_metric={item.trend_metric}
                trend_metric_unit={item.trend_metric_unit}
                help_text={item.help_text}
                has_alert={item.has_alert}
              />
            ))}
        </div>

        <br />
        <br />
        <br />

        <div style={{ display: "flex" }}>
          <InfoCard
            bannerColor="pink"
            icon=""
            title="In-Class Activity"
            helpWindowText="This is help text"
          >
            <h1>Test</h1>
          </InfoCard>
          <InfoCard
            bannerColor="yellow"
            icon=""
            title="Behavioral Engagement"
            helpWindowText="This is help text"
          >
            <h1>Test</h1>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
