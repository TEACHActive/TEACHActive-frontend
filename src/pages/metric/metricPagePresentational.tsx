import * as React from "react";
import { Empty } from "antd";

import { Session, SessionMetric, SessionMetricType } from "./metricPage.types";
import { InfoCard } from "../../components/InfoCard/infoCard";
import MetricDisplay from "../../components/MetricDisplay/metricDisplay";
import { InstructorMovement } from "../../components/InfoCard/instructorMovement";
import BlockContent from "../../components/BlockContent/blockContent";
import { BehavioralEngagement } from "../../components/InfoCard/behavioralEngagement";

import "./metricPage.css";

export interface ISessionPagePresentationalProps {
  session: Session | undefined;
}

export function SessionPagePresentational(
  props: ISessionPagePresentationalProps
) {
  if (!props.session) {
    return <div><Empty
    description={
      <span>
        Select a session from the dropdown near the top of the screen
      </span>
    }></Empty><h3>Please Select </h3></div>;
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
            props.session.metrics.map((item: SessionMetric, i: number) => {
              let icon: any = "";
              switch (item.metricType) {
                case SessionMetricType.HandRaises:
                  icon = "hand-paper";
                  break;
                case SessionMetricType.StudentSpeech:
                  icon = "comments";
                  break;
                case SessionMetricType.InstructorSpeech:
                  icon = "comment";
                  break;
                case SessionMetricType.ClassPerformance:
                  icon = "id-card";
                  break;
              }
              return (
                <BlockContent
                  color={item.color}
                  name={item.name}
                  help_text={item.help_text}
                  has_alert={item.has_alert}
                  icon={icon}
                  key={i}
                >
                  <MetricDisplay
                    metricType={item.metricType}
                    metric={item.metric}
                    denominator={item.denominator}
                    hasDenominator={item.hasDenominator}
                    unit={item.unit}
                    trend={item.trend}
                    trend_metric={item.trend_metric}
                    trend_metric_unit={item.trend_metric_unit}
                  />
                </BlockContent>
              );
            })}
        </div>

        <div style={{ display: "flex", marginTop: "3em" }}>
          {/* <BlockContent
            color={{ light: "#ED80A2", dark: "#D1728F" }}
            name="In-Class Activity"
            help_text="This is help text"
            has_alert={false}
            icon=""
            style={{
              width: "4em !important",
              height: "4em",
              left: "10px",
              top: "-20%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              borderRadius: "3px",
            }}
          >
            
          </BlockContent> */}
          <InfoCard
            color={{ light: "#ED80A2", dark: "#D1728F" }}
            icon=""
            title="Instructor Movement"
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
            <div className="infoCardContent">
              <BehavioralEngagement />
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
