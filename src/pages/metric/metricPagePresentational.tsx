import * as React from "react";
import { Button, Empty, Input, Typography } from "antd";

import { SessionMetric, SessionMetricType } from "./metricPage.types";
import { InfoCard } from "../../components/InfoCard/infoCard";
import MetricDisplay from "../../components/MetricDisplay/metricDisplay";
import { InstructorMovement } from "../../components/InfoCard/instructorMovement";
import BlockContent from "../../components/BlockContent/blockContent";
import { BehavioralEngagement } from "../../components/InfoCard/behavioralEngagement";

import { BaseSession, VideoFrameSession } from "../../api/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./metricPage.css";

const { Title } = Typography;

export interface ISessionPagePresentationalProps {
  session: BaseSession;
  metrics: SessionMetric[];
  setSessionName: (
    session: BaseSession,
    newSessionName: string
  ) => Promise<void>;
  videoFrames:
    | {
        instructor: VideoFrameSession[];
        student: VideoFrameSession[];
      }
    | undefined;
}

export function SessionPagePresentational(
  props: ISessionPagePresentationalProps
) {
  const [editingSessionName, setEditingSessionName] = React.useState(false);
  const [newSessionName, setNewSessionName] = React.useState("");

  if (!props.session) {
    return (
      <div>
        <Empty
          description={
            <span>
              Select a session from the dropdown near the top of the screen
            </span>
          }
        ></Empty>
        <h3>Please Select </h3>
      </div>
    );
  }

  return (
    <div className="metricPagePresentational">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "3em",
          minHeight: "5em",
        }}
      >
        {editingSessionName ? (
          <div style={{ display: "flex" }}>
            <Input
              placeholder={props.session.name}
              onChange={(event) => setNewSessionName(event.target.value)}
            />
            <Button type="primary" size="small">
              <FontAwesomeIcon
                icon="check"
                size="1x"
                color="blue"
                onClick={(event) => {
                  setEditingSessionName(false);
                  props.setSessionName(props.session, newSessionName);
                  setNewSessionName("");
                }}
              />
            </Button>
            <Button type="default" size="small" danger>
              <FontAwesomeIcon
                icon="ban"
                size="1x"
                color="red"
                onClick={(event) => {
                  setEditingSessionName(false);
                  setNewSessionName("");
                }}
              />
            </Button>
          </div>
        ) : (
          <>
            <Title>{props.session.name}</Title>
            {/* <FontAwesomeIcon
              icon="edit"
              size="1x"
              onClick={(event) => {
                event.stopPropagation();
                setEditingSessionName(true);
              }}
              className="sessionTitleEdit"
            /> */}
          </>
        )}
      </div>

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
          {props.metrics &&
            props.metrics.map((item: SessionMetric, i: number) => {
              return (
                <BlockContent
                  color={item.color}
                  name={item.name}
                  help_text={item.help_text}
                  has_alert={item.has_alert}
                  icon={item.icon}
                  key={i}
                >
                  <MetricDisplay
                    metricType={item.metricType}
                    metric={item.metric}
                    metricPrepend={item.metricPrepend}
                    denominator={item.denominator}
                    hasDenominator={item.hasDenominator}
                    unit={item.unit}
                    trend={item.trend}
                    trend_metric={item.trend_metric}
                    trend_metric_unit={item.trend_metric_unit}
                    canEdit={item.canEdit}
                    updateMetric={(newMetric: string) =>
                      item.updateMetric(
                        item.constructMetricUpdateObject(newMetric)
                      )
                    }
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
          ></BlockContent> */}
          <InfoCard
            color={{ light: "#ED80A2", dark: "#D1728F" }}
            icon=""
            title="Movement Patterns"
            helpWindowText="Movement Patterns during class //Todo"
          >
            <div className="infoCardContent">
              <InstructorMovement videoFrames={props.videoFrames} />
            </div>
          </InfoCard>
          <InfoCard
            color={{ light: "#FAB558", dark: "#E09F4B" }}
            icon=""
            title="Behavioral Engagement"
            helpWindowText="Behavioral Engagement during class //todo"
          >
            <div className="infoCardContent">
              <BehavioralEngagement videoFrames={props.videoFrames} />
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
