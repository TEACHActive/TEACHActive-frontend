import * as React from "react";
import { Empty } from "antd";

import { Session, SessionMetric } from "./sessionPage.types";
import { InfoCard } from "../../components/InfoCard/infoCard";
import MetricDisplay from "../../components/MetricDisplay/metricDisplay";
import { InstructorMovement } from "../../components/InfoCard/instructorMovement";

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
      <h1 style={{ marginBottom: "3em" }}>{props.session.className}</h1>
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
          {props.session.metrics &&
            props.session.metrics.map((item: SessionMetric, i: number) => (
              <MetricDisplay
                key={i}
                metricType={item.metricType}
                color={item.color}
                name={item.name}
                metric={item.metric}
                denominator={item.denominator}
                hasDenominator={item.hasDenominator}
                unit={item.unit}
                trend={item.trend}
                trend_metric={item.trend_metric}
                trend_metric_unit={item.trend_metric_unit}
                help_text={item.help_text}
                has_alert={item.has_alert}
              />
            ))}
        </div>

        <div style={{ display: "flex", marginTop: "2em" }}>
          <InfoCard
            color={{ light: "#ED80A2", dark: "#D1728F" }}
            icon=""
            title="In-Class Activity"
            helpWindowText="This is help text"
          >
            <div className="infoCardContent">
              <InstructorMovement />
            </div>
          </InfoCard>
          <InfoCard
            color={{ light: "#FAB558", dark: "#E09F4B" }}
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
