import React from "react";
import { Collapse, Result, Spin } from "antd";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";

import { Response } from "api/types";
import { Reflection, ReflectionSection } from "api/services/reflections/types";

import { SectionForm } from "components/SectionForm/sectionForm";
import { SessionMetricType } from "components/MetricDisplay/metricDisplay.types";
import { HandRaiseMetricDisplay } from "components/MetricDisplay/Metrics/handRasiseMetricDisplay";
import { StudentSpeechMetricDisplay } from "components/MetricDisplay/Metrics/studentSpeechMetricDisplay";
import { InstructorSpeechMetricDisplay } from "components/MetricDisplay/Metrics/instructorSpeechMetricDisplay";

import "./goals.scss";

const { Panel } = Collapse;

export interface IGoalsPagePresentationalProps {
  // createReflectionForSession: (sessionId: string) => any;
  getReflectionsForSession: (sessionId: string) => any;
  sessionId: string;
  getReflectionsForSessionResult: {
    status: QueryStatus;
    data?: Reflection;
    error?: undefined;
    isLoading: false;
    isSuccess: false;
    isError: false;
  } & any;
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
    props.getReflectionsForSession(props.sessionId);
  }, [props.sessionId]);

  const reflectionSectionMetricMap = new Map<
    string,
    { title: string; metricDisplay: React.ReactNode; comment: React.ReactNode }
  >();

  reflectionSectionMetricMap.set(SessionMetricType.HandRaises, {
    title: "Hand Raises",
    metricDisplay: <HandRaiseMetricDisplay />,
    comment: (
      <p>
        {/* During this section there were <strong></strong> seconds of hand raises */}
      </p>
    ),
  });
  reflectionSectionMetricMap.set(SessionMetricType.InstructorSpeech, {
    title: "Instructor Speech",
    metricDisplay: <InstructorSpeechMetricDisplay />,
    comment: <p>{/* During this section there were <strong></strong> */}</p>,
  });
  reflectionSectionMetricMap.set(SessionMetricType.StudentSpeech, {
    title: "Student Speech",
    metricDisplay: <StudentSpeechMetricDisplay />,
    comment: <p>{/* During this section there were <strong></strong> */}</p>,
  });
  reflectionSectionMetricMap.set("instructorMovement", {
    title: "Instructor Movement",
    metricDisplay: <StudentSpeechMetricDisplay />,
    comment: <p>{/* During this section there were <strong></strong> */}</p>,
  });

  const {
    isLoading,
    isFetching,
    isError,
    data,
  } = props.getReflectionsForSessionResult;

  if (isLoading || isFetching || !data) return <Spin />;
  if (isError)
    return <Result status="500" title="Error fetching reflections" />;

  return (
    <Collapse accordion className="goalsCollapse">
      {data.data.reflectionSections.map(
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
      )}
    </Collapse>
  );
}
