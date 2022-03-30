import React from "react";
import { Collapse } from "antd";

import { QUALTRICS_REFLECTION_URL } from "variables/enviromentVariables";
import { SessionMetricType } from "components/MetricDisplay/metricDisplay.types";
import { InstructorMovement } from "components/Graphs/InstructorMovement/instructorMovement";
import { HandRaiseMetricDisplay } from "components/MetricDisplay/Metrics/handRasiseMetricDisplay";
import { StudentSpeechMetricDisplay } from "components/MetricDisplay/Metrics/studentSpeechMetricDisplay";
import { InstructorSpeechMetricDisplay } from "components/MetricDisplay/Metrics/instructorSpeechMetricDisplay";

import "./goals.scss";
import { useSelector } from "react-redux";
import { selectSelectedSession } from "redux/sessionSlice";
import { SessionGraphType } from "components/Graphs/graphs.types";
import { SitVsStand } from "components/Graphs/SitVsStand/sitVsStand";

const { Panel } = Collapse;

export interface IGoalsPagePresentationalProps {
  sessionId: string;
  userUID?: string;
}

const qualtricsIFrameWidth = "100%",
  qualtricsIFrameHeight = "500em";

const qualtricsLink = QUALTRICS_REFLECTION_URL;

let iKey = 0;

/**
 * Page for setting goals and logging reflections
 * @param props
 */
export default function GoalsPagePresentational(
  props: IGoalsPagePresentationalProps
) {
  const selectedSession = useSelector(selectSelectedSession);

  React.useEffect(() => {
    // props.getReflectionsForSession(props.sessionId);
  }, [props.sessionId]);

  return (
    <Collapse accordion className="goalsCollapse" defaultActiveKey={0}>
      {/* ActiveLearningStrategies  */}
      {PanelDisplay({
        header: "Active Learning Strategies",
        key: 0,
        userUID: props.userUID || "",
        sessionId: props.sessionId,
        sectionName: "activeLearningStrategies",
      })}
      {/* SessionMetricType.HandRaises */}
      {PanelDisplay({
        header: "Hand Raises",
        key: 1,
        userUID: props.userUID || "",
        sessionId: props.sessionId,
        sectionName: SessionMetricType.HandRaises,
        metrics: <HandRaiseMetricDisplay sessionId={selectedSession?.id} />,
      })}
      {/* Speech */}
      {PanelDisplay({
        header: "Instructor and Student Speech",
        key: 2,
        userUID: props.userUID || "",
        sessionId: props.sessionId,
        sectionName: "speech", // Combined so it just needs to mirror the qualtrics embeded data sectionName
        metrics: (
          <>
            <InstructorSpeechMetricDisplay sessionId={selectedSession?.id} />
            <StudentSpeechMetricDisplay sessionId={selectedSession?.id} />
          </>
        ),
      })}
      {/* SessionGraphType.SitVStand */}
      {PanelDisplay({
        header: "Sit vs Stand",
        key: 3,
        userUID: props.userUID || "",
        sessionId: props.sessionId,
        sectionName: SessionGraphType.SitVStand,
        metrics: <SitVsStand sessionId={selectedSession?.id} />,
      })}
      {/* "instructorMovement" */}
      {PanelDisplay({
        header: "Instructor Movement",
        key: 4,
        userUID: props.userUID || "",
        sessionId: props.sessionId,
        sectionName: SessionGraphType.InstructorMovement,
        metrics: <InstructorMovement sessionId={selectedSession?.id} />,
      })}
      {/* Overall Reflection*/}
      {PanelDisplay({
        header: "Overall Reflection",
        key: 5,
        userUID: props.userUID || "",
        sessionId: props.sessionId,
        sectionName: "overallReflection",
      })}
    </Collapse>
  );
}

export const PanelDisplay = (props: {
  header: string;
  key?: number;
  metrics?: React.ReactNode;
  sectionName: string;
  userUID: string;
  sessionId: string;
}) => {
  return (
    <Panel
      header={props.header}
      key={props.key ?? iKey++}
      style={{ fontSize: "large", fontWeight: "bolder" }}
    >
      {props.metrics}
      <iframe
        src={`${qualtricsLink}?uid=${props.userUID || ""}&sessionID=${
          props.sessionId
        }&sectionName=${props.sectionName}`}
        height={qualtricsIFrameHeight}
        width={qualtricsIFrameWidth}
      />
    </Panel>
  );
};
