import React from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "app/hooks";
import { Button, Input, message, Typography } from "antd";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ISession } from "api/services/sessions/types";
import { InfoCard } from "components/InfoCard/infoCard";
import { SitVsStand } from "components/Graphs/SitVsStand/sitVsStand";
import { selectSelectedSession, updateSessionName } from "redux/sessionSlice";
import { DetectInvalidSession } from "components/DetectInvalidSession/detectInvalidSession";
import { InstructorMovement } from "components/Graphs/InstructorMovement/instructorMovement";
import { HandRaiseMetricDisplay } from "components/MetricDisplay/Metrics/handRasiseMetricDisplay";
import { BehavioralEngagement } from "components/Graphs/BehavioralEngagement/behavioralEngagement";
import { AttendanceMetricDisplay } from "components/MetricDisplay/Metrics/attendanceMetricDisplay";
import { PerformanceMetricDisplay } from "components/MetricDisplay/Metrics/performanceMetricDisplay";
import { StudentSpeechMetricDisplay } from "components/MetricDisplay/Metrics/studentSpeechMetricDisplay";
import { InstructorSpeechMetricDisplay } from "components/MetricDisplay/Metrics/instructorSpeechMetricDisplay";

import "./metrics.scss";
import { ClassroomDynamicsInfoCard } from "components/InfoCard/InfoCards/ClassroomDynamicsInfoCard";
import { InstructorMovementInfoCard } from "components/InfoCard/InfoCards/InstructorMovementInfoCard";
import { SitVStandInfoCard } from "components/InfoCard/InfoCards/sitVStandInfoCard";

const { Title } = Typography;

export interface IMetricsPagePresentationalProps {
  session: ISession;
  updateSessionName: (arg: { sessionId: string; name: string }) => any;
  refetchSessions: () => void;
  // setSelectedSessionById: (id: string) => void;
}

export function MetricsPagePresentational(
  props: IMetricsPagePresentationalProps
) {
  const selectedSession = useSelector(selectSelectedSession);
  const [editingSessionName, setEditingSessionName] = React.useState(false);
  const [newSessionName, setNewSessionName] = React.useState(
    props.session.name || ""
  );

  const dispatch = useAppDispatch();

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

                  // props.setSelectedSessionById()
                  props.refetchSessions();
                  dispatch(updateSessionName(newSessionName));
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
            <Title>{props.session.name}</Title>
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

        <div className="infoCards">
          <SitVStandInfoCard sessionId={selectedSession?.id} />
          <InstructorMovementInfoCard sessionId={selectedSession?.id} />
          <ClassroomDynamicsInfoCard sessionId={selectedSession?.id} />

          {/* Todo: Add a seperate card for audio? */}
        </div>
      </div>
    </div>
  );
}
