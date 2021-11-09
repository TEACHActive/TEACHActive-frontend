import * as React from "react";

import { Button, Empty, Input, Spin, Typography } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ArmPose, BaseSession, Person, VideoFrameSession } from "api/types";
import { SessionMetric } from "./metricPage.types";
import { InfoCard } from "components/InfoCard/infoCard";
import BlockContent from "components/BlockContent/blockContent";
import MetricDisplay from "components/MetricDisplay/metricDisplay";
import { MovementPatterns } from "components/MovementPatterns/movementPatterns";
import { BehavioralEngagement } from "components/BehavioralEngagement/behavioralEngagement";

import "./metricPage.css";
import { SitVsStand } from "components/MovementPatterns/sitVsStand";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import { InstructorMovement } from "components/MovementPatterns/instructorMovement";

const { Title } = Typography;

export interface IMetricPagePresentationalProps {
  session: BaseSession;
  metrics: SessionMetric[];
  setSessionName: (
    session: BaseSession,
    newSessionName: string
  ) => Promise<void>;
  loadingMetrics: boolean;
}

export function MetricPagePresentational(
  props: IMetricPagePresentationalProps
) {
  const [editingSessionName, setEditingSessionName] = React.useState(false);
  const [newSessionName, setNewSessionName] = React.useState("");
  const [updatedSessionName, setUpdatedSessionName] = React.useState("");

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
          overflow: "auto",
          height: "100%",
        }}
      >
        {editingSessionName ? (
          <div style={{ display: "flex" }}>
            <Input
              placeholder={props.session.name}
              onChange={(event) => setNewSessionName(event.target.value)}
            />
            {/*Todo: add this back */}
            {/* <Button type="primary" size="small">
              <FontAwesomeIcon
                icon="check"
                size="1x"
                color="blue"
                onClick={(event) => {
                  setEditingSessionName(false);
                  props.setSessionName(props.session, newSessionName);
                  setUpdatedSessionName(newSessionName); //Todo: figure out why this isnt automatic
                  setNewSessionName("");
                }}
              />
            </Button> */}
            {/* <Button type="default" size="small" danger>
              <FontAwesomeIcon
                icon="ban"
                size="1x"
                color="red"
                onClick={(event) => {
                  setEditingSessionName(false);
                  setNewSessionName("");
                }}
              />
            </Button> */}
          </div>
        ) : (
          <>
            <Title>
              {updatedSessionName === ""
                ? props.session.name
                : updatedSessionName}
            </Title>
            <FontAwesomeIcon
              icon="edit"
              size="1x"
              onClick={(event) => {
                event.stopPropagation();
                setEditingSessionName(true);
              }}
              className="sessionTitleEdit"
            />
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
            flexWrap: "wrap",
          }}
        >
          {props.loadingMetrics ? (
            <Spin />
          ) : (
            props.metrics &&
            props.metrics.map((item: SessionMetric, i: number) => {
              return (
                <BlockContent
                  color={item.color}
                  name={item.name}
                  help_text={item.help_text}
                  has_alert={item.has_alert}
                  icon={item.icon}
                  key={i}
                  style={{ marginTop: "2em", marginBottom: "2em" }}
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
                    updateMetric={(newMetric: string) => {
                      return item.updateMetric(newMetric);
                    }}
                  >
                    {item.children}
                  </MetricDisplay>
                </BlockContent>
              );
            })
          )}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "3em",
            overflowX: "auto",
          }}
        >
          {/* <BlockContent
            color={{ light: "#ED80A2", dark: "#D1728F" }}
            name="In-Class Activity"
            help_text="Movement Patterns during class //Todo"
            has_alert={false}
          >
            <div className="infoCardContent">
              <MovementPatterns />
            </div>
          </BlockContent> */}
          {/* <BlockContent
            color={{ light: "#FAB558", dark: "#E09F4B" }}
            name="Behavioral Engagement"
            help_text="Behavioral Engagement during class //Todo"
            has_alert={false}
          >
            <div className="infoCardContent">
              <BehavioralEngagement />
            </div>
          </BlockContent> */}
          <InfoCard
            color={{ light: "#ED80A2", dark: "#D1728F" }}
            icon=""
            title="Sit vs Stand"
            helpWindowText="Movement Patterns during class //Todo"
            style={{ margin: ".5em" }}
          >
            <div className="infoCardContent">
              <SitVsStand />
            </div>
          </InfoCard>
          <InfoCard
            color={{ light: "#ED80A2", dark: "#D1728F" }}
            icon=""
            title="Instructor Movement"
            helpWindowText="Movement Patterns during class //Todo"
            style={{ margin: ".5em" }}
          >
            <div className="infoCardContent">
              <FirebaseAuthConsumer>
                {({
                  isSignedIn,
                  user,
                }: {
                  isSignedIn: boolean;
                  user: firebase.default.User;
                }) => <InstructorMovement uid={user.uid} />}
              </FirebaseAuthConsumer>
            </div>
          </InfoCard>

          <InfoCard
            color={{ light: "#FAB558", dark: "#E09F4B" }}
            icon=""
            title="Behavioral Engagement"
            helpWindowText="Behavioral Engagement during class //Todo"
            style={{ margin: ".5em" }}
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
