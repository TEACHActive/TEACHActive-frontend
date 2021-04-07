import * as React from "react";
import { Empty, Spin } from "antd";
import { useSelector } from "react-redux";

import { SessionPagePresentational } from "./metricPagePresentational";

import "./metricPage.css";
import { BaseSession, VideoFrame, Person } from "../../api/types";
import apiHandler from "../../api/handler";
import { SessionMetric } from "./metricPage.types";

export interface IMetricPageProps {}

const InitArmPoseObj = {
  handsOnFace: 0,
  handRaised: 0,
  armsCrossed: 0,
  error: 0,
  other: 0,
};

export default function MetricPage(props: IMetricPageProps) {
  const selectedSession: BaseSession | null = useSelector(
    (state: any) => state.session.selectedSession,
    BaseSession.equal
  );
  const [loading, setLoading] = React.useState(true);
  const [totalArmPoseFrames, setTotalArmPoseFrames] = React.useState(
    InitArmPoseObj
  );

  React.useEffect(() => {
    if (selectedSession) analyzeFrames(selectedSession);
  }, [selectedSession]);

  const analyzeFrames = async (selectedSession: BaseSession) => {
    console.log("analyzeFrames");

    const studentFrames = apiHandler.getFramesBySessionID(
      selectedSession.id,
      "student"
    );
    const instructorFrames = apiHandler.getFramesBySessionID(
      selectedSession.id,
      "instructor"
    );

    const results = await Promise.all([studentFrames, instructorFrames]);
    console.log(results[0][0]);

    // results[0][0].videoFrames.forEach((frame: VideoFrame) => {
    //   frame.people.forEach((person: Person) => {
    //     if (person.armpose === "handRaised") console.log(person.armpose);
    //   });
    // });

    const studentArmPoseFrames = results[0][0].videoFrames.reduce(
      (accumulator1: typeof InitArmPoseObj, frame: VideoFrame) => {
        const armPoses = frame.people.reduce(
          (accumulator2: typeof InitArmPoseObj, person: Person) => {
            return {
              handsOnFace:
                accumulator2.handsOnFace +
                (person.armpose === "handsOnFace" ? 0 : 1),
              handRaised:
                accumulator2.handRaised +
                (person.armpose === "handRaised" ? 0 : 1),
              armsCrossed:
                accumulator2.armsCrossed +
                (person.armpose === "armsCrossed" ? 0 : 1),
              error: accumulator2.error + (person.armpose === "error" ? 0 : 1),
              other: accumulator2.other + (person.armpose === "other" ? 0 : 1),
            };
          },
          InitArmPoseObj
        );
        return {
          handsOnFace: accumulator1.handsOnFace + armPoses.handsOnFace,
          handRaised: accumulator1.handRaised + armPoses.handRaised,
          armsCrossed: accumulator1.armsCrossed + armPoses.armsCrossed,
          error: accumulator1.error + armPoses.error,
          other: accumulator1.other + armPoses.other,
        };
      },
      InitArmPoseObj
    );

    setTotalArmPoseFrames(studentArmPoseFrames);

    setLoading(false);
  };

  if (!selectedSession) return <Empty />;

  if (loading) return <Spin />;

  const handRaiseSessionMetric = new SessionMetric({
    metricType: "HandRaises",
    name: "Hand Raises",
    color: {
      dark: "#E6AE05",
      light: "#FFC107",
    },
    metric: totalArmPoseFrames.handRaised,
    hasDenominator: false,
    denominator: 0,
    unit: "",
    trend: 1,
    trend_metric: 0,
    trend_metric_unit: "",
    help_text:
      "The total frequency of detected hand raises during the class session",
    has_alert: false,
  });

  // const studentSpeechSessionMetric = new SessionMetric({
  //   metricType: "StudentSpeech",
  //   name: "Student Speech",
  //   color: {
  //     dark: "#CB1859",
  //     light: "#D81B60",
  //   },
  //   metric: 10,
  //   hasDenominator: true,
  //   denominator: 50,
  //   unit: "min",
  //   trend: 0,
  //   trend_metric: 0,
  //   trend_metric_unit: "min",
  //   help_text:
  //     "The total frequency of student talk (in minutes) during the class session",
  //   has_alert: false,
  // });
  // const instructorSpeechSessionMetric = new SessionMetric({
  //   metricType: "InstructorSpeech",
  //   name: "Instructor Speech",
  //   color: {
  //     dark: "#01332A",
  //     light: "#004D40",
  //   },
  //   metric: 20,
  //   hasDenominator: true,
  //   denominator: 50,
  //   unit: "min",
  //   trend: 0,
  //   trend_metric: 0,
  //   trend_metric_unit: "min",
  //   help_text:
  //     "The total frequency of instructor talk (in minutes) during the class session",
  //   has_alert: false,
  // });
  const classPreformanceSessionMetric = new SessionMetric({
    metricType: "ClassPerformance",
    name: "Class Performance",
    color: {
      dark: "#1E7FD4",
      light: "#1E88E5",
    },
    metric: 0,
    hasDenominator: false,
    denominator: 0,
    unit: "%",
    trend: 0,
    trend_metric: 0,
    trend_metric_unit: "%",
    help_text:
      "Did you do any graded activity in this class session? You may enter manually the average class performance and compare them with future sessions!",
    has_alert: false,
  });
  const metrics: SessionMetric[] = [
    handRaiseSessionMetric,
    // studentSpeechSessionMetric,
    // instructorSpeechSessionMetric,
    classPreformanceSessionMetric,
  ];

  return (
    <SessionPagePresentational session={selectedSession} metrics={metrics} />
  );
}
