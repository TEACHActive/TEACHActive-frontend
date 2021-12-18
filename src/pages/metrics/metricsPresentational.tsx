import React from "react";
import { Button, Input, Typography } from "antd";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ISession } from "api/services/sessions/types";
import { InfoCard } from "components/InfoCard/infoCard";

import { SitVsStand } from "components/Graphs/SitVsStand/sitVsStand";
import { InstructorMovement } from "components/Graphs/InstructorMovement/instructorMovement";
import { HandRaiseMetricDisplay } from "components/MetricDisplay/Metrics/handRasiseMetricDisplay";
import { BehavioralEngagement } from "components/Graphs/BehavioralEngagement/behavioralEngagement";
import { AttendanceMetricDisplay } from "components/MetricDisplay/Metrics/attendanceMetricDisplay";
import { PerformanceMetricDisplay } from "components/MetricDisplay/Metrics/performanceMetricDisplay";
import { StudentSpeechMetricDisplay } from "components/MetricDisplay/Metrics/studentSpeechMetricDisplay";
import { InstructorSpeechMetricDisplay } from "components/MetricDisplay/Metrics/instructorSpeechMetricDisplay";

import "./metrics.scss";

const { Title } = Typography;

export interface IMetricsPagePresentationalProps {
  session: ISession;
  updateSessionName: (arg: { sessionId: string; name: string }) => any;
  updateSessionNameResult: {
    status: QueryStatus;
    data?: undefined;
    error?: undefined;
    isLoading: false;
    isSuccess: false;
    isError: false;
  } & any;
}

export function MetricsPagePresentational(
  props: IMetricsPagePresentationalProps
) {
  const [editingSessionName, setEditingSessionName] = React.useState(false);
  const [newSessionName, setNewSessionName] = React.useState(
    props.session.name || ""
  );

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
            <Button type="primary" size="small">
              <FontAwesomeIcon
                icon="check"
                size="1x"
                color="blue"
                onClick={(event) => {
                  setEditingSessionName(false);
                  props.updateSessionName({
                    sessionId: props.session.id,
                    name: newSessionName,
                  });
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
            <Title>
              {props.updateSessionNameResult.status === QueryStatus.fulfilled
                ? props.updateSessionNameResult.data.name
                : props.session.name}
            </Title>
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
            flexWrap: "wrap",
          }}
        >
          <HandRaiseMetricDisplay />
          <InstructorSpeechMetricDisplay />
          <StudentSpeechMetricDisplay />
          <PerformanceMetricDisplay />
          <AttendanceMetricDisplay />
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "3em",
            overflowX: "auto",
          }}
        >
          <InfoCard
            color={{ light: "#ED80A2", dark: "#D1728F" }}
            icon=""
            title="Sit vs Stand"
            helpWindowText="Sit vs stand data in session"
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
            helpWindowText="Movement Patterns during class"
            style={{ margin: ".5em" }}
          >
            <div className="infoCardContent">
              <InstructorMovement />
            </div>
          </InfoCard>

          <InfoCard
            color={{ light: "#FAB558", dark: "#E09F4B" }}
            icon=""
            title=""
            helpWindowText="Behavioral Engagement during class"
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
