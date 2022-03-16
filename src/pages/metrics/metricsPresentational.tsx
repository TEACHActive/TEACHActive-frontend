import React from "react";
import { Button, Input, message, Typography } from "antd";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ISession } from "api/services/sessions/types";
import { InfoCard } from "components/InfoCard/infoCard";

import { SitVsStand } from "components/Graphs/SitVsStand/sitVsStand";
import { DetectInvalidSession } from "components/DetectInvalidSession/detectInvalidSession";
import { InstructorMovement } from "components/Graphs/InstructorMovement/instructorMovement";
import { HandRaiseMetricDisplay } from "components/MetricDisplay/Metrics/handRasiseMetricDisplay";
import { BehavioralEngagement } from "components/Graphs/BehavioralEngagement/behavioralEngagement";
import { AttendanceMetricDisplay } from "components/MetricDisplay/Metrics/attendanceMetricDisplay";
import { PerformanceMetricDisplay } from "components/MetricDisplay/Metrics/performanceMetricDisplay";
import { StudentSpeechMetricDisplay } from "components/MetricDisplay/Metrics/studentSpeechMetricDisplay";
import { InstructorSpeechMetricDisplay } from "components/MetricDisplay/Metrics/instructorSpeechMetricDisplay";

import "./metrics.scss";
import { useSelector } from "react-redux";
import { selectSelectedSession } from "redux/sessionSlice";

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
  const selectedSession = useSelector(selectSelectedSession);
  const [editingSessionName, setEditingSessionName] = React.useState(false);
  const [newSessionName, setNewSessionName] = React.useState(
    props.session.name || ""
  );

  React.useEffect(() => {
    setNewSessionName(props.session.name || "");
  }, [props.session]);

  return (
    <div className="metricPagePresentational">
      <DetectInvalidSession />
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
                onClick={async (_) => {
                  setEditingSessionName(false);
                  const result = await props.updateSessionName({
                    sessionId: props.session.id,
                    name: newSessionName,
                  });

                  if (result.error) {
                    message.error(result.error.data.errorMessage);
                  }

                  setNewSessionName(result.data.data.name); // Todo: Constrain return type to make this less gross
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
                  setNewSessionName(newSessionName);
                }}
              />
            </Button>
          </div>
        ) : (
          <>
            <Title>{newSessionName ?? props.session.name}</Title>
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
          <HandRaiseMetricDisplay sessionId={selectedSession?.id} />
          <InstructorSpeechMetricDisplay sessionId={selectedSession?.id} />
          <StudentSpeechMetricDisplay sessionId={selectedSession?.id} />
          <PerformanceMetricDisplay sessionId={selectedSession?.id} />
          <AttendanceMetricDisplay sessionId={selectedSession?.id} />
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "3em",
            flexWrap: "wrap",
          }}
        >
          <InfoCard
            color={{ light: "#ED80A2", dark: "#D1728F" }}
            title="Sit vs Stand"
            helpWindowContent={<p>Sit vs stand data in session</p>}
            style={{ margin: ".5em" }}
          >
            <div className="infoCardContent">
              <SitVsStand />
            </div>
          </InfoCard>
          <InfoCard
            color={{ light: "#ED80A2", dark: "#D1728F" }}
            title="Instructor Movement"
            helpWindowContent={<p>Movement Patterns during class</p>}
            style={{
              margin: ".5em",
              overflowY: "auto",
              overflowX: "hidden",
              height: "100%",
            }}
          >
            <div className="infoCardContent">
              <InstructorMovement />
            </div>
          </InfoCard>

          <InfoCard
            color={{ light: "#FAB558", dark: "#E09F4B" }}
            title="Classroom Dynamics"
            helpWindowContent={<p>Behavioral Engagement during class</p>}
            style={{ margin: ".5em" }}
          >
            <div className="infoCardContent">
              <BehavioralEngagement />
            </div>
          </InfoCard>

          {/* Todo: Add a seperate card for audio? */}
        </div>
      </div>
    </div>
  );
}
