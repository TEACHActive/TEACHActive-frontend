import React from "react";
import { Collapse, Result, Spin } from "antd";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";

// import { SectionForm } from "components/SectionForm/sectionForm";
// import { SessionMetricType } from "components/MetricDisplay/metricDisplay.types";
// import { HandRaiseMetricDisplay } from "components/MetricDisplay/Metrics/handRasiseMetricDisplay";
// import { StudentSpeechMetricDisplay } from "components/MetricDisplay/Metrics/studentSpeechMetricDisplay";
// import { InstructorSpeechMetricDisplay } from "components/MetricDisplay/Metrics/instructorSpeechMetricDisplay";
import * as Question from "../../components/Questions";
import { Reflection } from "api/services/reflections/types";
import { HandRaisesSection } from "./sectionPanels/handRaises";
import { StudentSpeechSection } from "./sectionPanels/studentSpeech";
import { InstructorSpeechSection } from "./sectionPanels/instructorSpeech";
import { InstructorMovementSection } from "./sectionPanels/instructorMovement";
import { SessionMetricType } from "components/MetricDisplay/metricDisplay.types";
import { HandRaiseMetricDisplay } from "components/MetricDisplay/Metrics/handRasiseMetricDisplay";
import { InstructorMovement } from "components/Graphs/InstructorMovement/instructorMovement";
import { InstructorSpeechMetricDisplay } from "components/MetricDisplay/Metrics/instructorSpeechMetricDisplay";
import { StudentSpeechMetricDisplay } from "components/MetricDisplay/Metrics/studentSpeechMetricDisplay";

import "./goals.scss";

const { Panel } = Collapse;

export interface IGoalsPagePresentationalProps {
  // createReflectionForSession: (sessionId: string) => any;
  // getReflectionsForSession: (sessionId: string) => any;
  sessionId: string;
  // getReflectionsForSessionResult: {
  //   status: QueryStatus;
  //   data?: Reflection;
  //   error?: any;
  //   isLoading: boolean;
  //   isSuccess: boolean;
  //   isError: boolean;
  // };
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

  // const reflectionSectionMetricMap = new Map<
  //   string,
  //   { title: string; metricDisplay: React.ReactNode; comment: React.ReactNode }
  // >();

  // reflectionSectionMetricMap.set(SessionMetricType.HandRaises, {
  //   title: "Hand Raises",
  //   metricDisplay: <HandRaiseMetricDisplay />,
  //   comment: (
  //     <p>
  //       {/* During this section there were <strong></strong> seconds of hand raises */}
  //     </p>
  //   ),
  // });
  // reflectionSectionMetricMap.set(SessionMetricType.InstructorSpeech, {
  //   title: "Instructor Speech",
  //   metricDisplay: <InstructorSpeechMetricDisplay />,
  //   comment: <p>{/* During this section there were <strong></strong> */}</p>,
  // });
  // reflectionSectionMetricMap.set(SessionMetricType.StudentSpeech, {
  //   title: "Student Speech",
  //   metricDisplay: <StudentSpeechMetricDisplay />,
  //   comment: <p>{/* During this section there were <strong></strong> */}</p>,
  // });
  // reflectionSectionMetricMap.set("instructorMovement", {
  //   title: "Instructor Movement",
  //   metricDisplay: <StudentSpeechMetricDisplay />,
  //   comment: <p>{/* During this section there were <strong></strong> */}</p>,
  // });

  const onSectionFinish = (sectionName: string, values: any) => {
    console.log(sectionName, values);
  };

  const onSectionFail = (sectionName: string) => {};

  // const { isLoading, isError, data } = props.getReflectionsForSessionResult;

  // if (isLoading || !data) return <Spin />;
  // if (isError)
  //   return <Result status="500" title="Error fetching reflections" />;

  const qualtricsIFrameWidth = "100%",
    qualtricsIFrameHeight = "500em";
  const qualtricsLink =
    "https://iastate.qualtrics.com/jfe/form/SV_8CzGWuq3dOk1OaG";

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
