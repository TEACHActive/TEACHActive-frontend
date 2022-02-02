import React from "react";
import { Collapse } from "antd";

import { SessionMetricType } from "components/MetricDisplay/metricDisplay.types";
import { HandRaiseMetricDisplay } from "components/MetricDisplay/Metrics/handRasiseMetricDisplay";
import { InstructorMovement } from "components/Graphs/InstructorMovement/instructorMovement";
import { InstructorSpeechMetricDisplay } from "components/MetricDisplay/Metrics/instructorSpeechMetricDisplay";
import { StudentSpeechMetricDisplay } from "components/MetricDisplay/Metrics/studentSpeechMetricDisplay";

import "./goals.scss";
import { QUALTRICS_REFLECTION_URL } from "variables/enviromentVariables";

const { Panel } = Collapse;

export interface IGoalsPagePresentationalProps {
  sessionId: string;
  userUID?: string;
}

/**
 * Page for setting goals and logging reflections
 * Note: This component would benifit from using Formik
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
        {/* <HandRaisesSection
          onFinish={onSectionFinish}
          onFinishFailed={onSectionFail}
        /> */}
      </Panel>
      {/* SessionMetricType.InstructorSpeech */}
      <Panel
        header={"Instructor Speech"}
        key={2}
        style={{ fontSize: "large", fontWeight: "bolder" }}
      >
        <InstructorSpeechMetricDisplay />
        {/* <InstructorSpeechSection
          onFinish={onSectionFinish}
          onFinishFailed={onSectionFail}
        /> */}
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
        {/* <StudentSpeechSection
          onFinish={onSectionFinish}
          onFinishFailed={onSectionFail}
        /> */}
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
        {/* <InstructorMovementSection
          onFinish={onSectionFinish}
          onFinishFailed={onSectionFail}
        /> */}
      </Panel>
      {/* {data.reflectionSections.map(
        (reflectionSection: ReflectionSection, i: number) => {
          const metricMap = reflectionSectionMetricMap.get(
            reflectionSection.name
          );

          return (
            <Panel
              header={reflectionSection.title}
              key={i}
              style={{ fontSize: "large", fontWeight: "bolder" }}
            >
              <SectionForm
                section={reflectionSection}
                metricDisplay={metricMap?.metricDisplay}
                comment={metricMap?.comment}
                sessionId={props.sessionId}
              />
            </Panel>
          );
        }
      )} */}
    </Collapse>
  );
}
