import React from "react";
import { Collapse } from "antd";

import { QUALTRICS_REFLECTION_URL } from "variables/enviromentVariables";
import { SessionMetricType } from "components/MetricDisplay/metricDisplay.types";
import { InstructorMovement } from "components/Graphs/InstructorMovement/instructorMovement";
import { HandRaiseMetricDisplay } from "components/MetricDisplay/Metrics/handRasiseMetricDisplay";
import { StudentSpeechMetricDisplay } from "components/MetricDisplay/Metrics/studentSpeechMetricDisplay";
import { InstructorSpeechMetricDisplay } from "components/MetricDisplay/Metrics/instructorSpeechMetricDisplay";

import "./goals.scss";

const { Panel } = Collapse;

export interface IGoalsPagePresentationalProps {
  sessionId: string;
  userUID?: string;
}

/**
 * Page for setting goals and logging reflections
 * @param props
 */
export default function GoalsPagePresentational(
  props: IGoalsPagePresentationalProps
) {
  React.useEffect(() => {
    // props.getReflectionsForSession(props.sessionId);
  }, [props.sessionId]);

  const qualtricsIFrameWidth = "100%",
    qualtricsIFrameHeight = "500em";

  const qualtricsLink = QUALTRICS_REFLECTION_URL;

  return (
    <Collapse accordion className="goalsCollapse">
      {/* SessionMetricType.HandRaises */}
      <Panel
        header={"Hand Raises"}
        key={1}
        style={{ fontSize: "large", fontWeight: "bolder" }}
      >
        <HandRaiseMetricDisplay />
        <iframe
          src={`${qualtricsLink}?uid=${props.userUID || ""}&sessionID=${
            props.sessionId
          }&sectionName=${SessionMetricType.HandRaises}`}
          height={qualtricsIFrameHeight}
          width={qualtricsIFrameWidth}
        />
      </Panel>
      {/* SessionMetricType.InstructorSpeech */}
      <Panel
        header={"Instructor Speech"}
        key={2}
        style={{ fontSize: "large", fontWeight: "bolder" }}
      >
        <InstructorSpeechMetricDisplay />
        <iframe
          src={`${qualtricsLink}?uid=${props.userUID || ""}&sessionID=${
            props.sessionId
          }&sectionName=${SessionMetricType.InstructorSpeech}`}
          height={qualtricsIFrameHeight}
          width={qualtricsIFrameWidth}
        />
      </Panel>
      {/* SessionMetricType.StudentSpeech */}
      <Panel
        header={"Student Speech"}
        key={3}
        style={{ fontSize: "large", fontWeight: "bolder" }}
      >
        <StudentSpeechMetricDisplay />
        <iframe
          src={`${qualtricsLink}?uid=${props.userUID || ""}&sessionID=${
            props.sessionId
          }&sectionName=${SessionMetricType.StudentSpeech}`}
          height={qualtricsIFrameHeight}
          width={qualtricsIFrameWidth}
        />
      </Panel>
      {/* "instructorMovement" */}
      <Panel
        header={"Instructor Movement"}
        key={4}
        style={{ fontSize: "large", fontWeight: "bolder" }}
      >
        <InstructorMovement />
        <iframe
          src={`${qualtricsLink}?uid=${props.userUID || ""}&sessionID=${
            props.sessionId
          }&sectionName=instructorMovement`}
          height={qualtricsIFrameHeight}
          width={qualtricsIFrameWidth}
        />
      </Panel>
    </Collapse>
  );
}
