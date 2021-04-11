import * as React from "react";
import { Empty, Spin } from "antd";
import { useSelector } from "react-redux";

import { SessionPagePresentational } from "./metricPagePresentational";

import "./metricPage.css";
import { BaseSession, VideoFrame, Person } from "../../api/types";
import apiHandler from "../../api/handler";
import { SessionMetric, SessionMetricType } from "./metricPage.types";
// import { SessionMetric } from "./metricPage.types";

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
  const [avgNumberStudents, setAvgNumberStudents] = React.useState(0);

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
    const videoFrames = results[0][0].videoFrames;
    const studentArmPoseFrames = videoFrames.reduce(
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

    const avgNumStudentsDetected = videoFrames.reduce(
      (acc: number, frame: VideoFrame, i: number, arr: VideoFrame[]) => {
        return acc + frame.people.length / arr.length;
      },
      0
    );

    console.log("Avg Students", avgNumStudentsDetected);
    setAvgNumberStudents(avgNumStudentsDetected);

    const numberOfConcecutiveFramesToBeHandRaised = 10;
    const numberOfConcecutiveFramesToBeHandDown = 10;
    let peopleHandRaiseTracker: {
      concecutiveFramesHandRaised: number;
      concecutiveFramesHandDown: number;
      numberHandRaises: number;
      //Could also track length of each hand raise
    }[] = [];
    for (let frameNumber = 1; frameNumber < videoFrames.length; frameNumber++) {
      //Assuming at least one frame
      const videoFrame = videoFrames[frameNumber];
      const people = videoFrame.people;
      for (let personIndex = 0; personIndex < people.length; personIndex++) {
        const person = people[personIndex];
        const handRaised = person.armpose === "handRaised";

        let personHandTracker = getDefaultObjectAt(
          peopleHandRaiseTracker,
          personIndex
        );
        // console.log(person.armpose);

        if (handRaised) {
          //Frame with hand raise
          console.log(1);

          if (
            personHandTracker.concecutiveFramesHandRaised >=
            numberOfConcecutiveFramesToBeHandRaised
          ) {
            getDefaultObjectAt(peopleHandRaiseTracker, personIndex)
              .numberHandRaises++;
            getDefaultObjectAt(
              peopleHandRaiseTracker,
              personIndex
            ).concecutiveFramesHandDown = 0;
          } else {
            getDefaultObjectAt(
              peopleHandRaiseTracker,
              personIndex
            ).concecutiveFramesHandRaised += 1;
          }
        } else {
          //Frame without hand raise
          if (
            personHandTracker.concecutiveFramesHandDown >=
            numberOfConcecutiveFramesToBeHandDown
          ) {
            getDefaultObjectAt(
              peopleHandRaiseTracker,
              personIndex
            ).concecutiveFramesHandRaised = 0;
          } else {
            getDefaultObjectAt(
              peopleHandRaiseTracker,
              personIndex
            ).concecutiveFramesHandDown += 1;
          }
        }
      }
    }

    console.log(peopleHandRaiseTracker);

    setLoading(false);
  };

  function getDefaultObjectAt(array: any[], index: number) {
    return (array[index] = array[index] || {});
  }

  if (!selectedSession) return <Empty />;

  if (loading) return <Spin />;

  const handRaiseSessionMetric = new SessionMetric({
    metricType: SessionMetricType.HandRaises,
    name: "Hand Raises",
    color: {
      dark: "#E6AE05",
      light: "#FFC107",
    },
    metric: totalArmPoseFrames.handRaised,
    metricPrepend: "",
    hasDenominator: false,
    denominator: 0,
    unit: "",
    trend: 1,
    trend_metric: 0,
    trend_metric_unit: "",
    help_text:
      "The total frequency of detected hand raises during the class session",
    has_alert: false,
    icon: "hand-paper",
    canEdit: false,
  });

  // const studentSpeechSessionMetric = new SessionMetric({
  //   metricType: SessionMetricType.StudentSpeech,
  //   name: "Student Speech",
  //   color: {
  //     dark: "#CB1859",
  //     light: "#D81B60",
  //   },
  //   metric: 10,
  // metricPrepend: "",
  //   hasDenominator: true,
  //   denominator: 50,
  //   unit: "min",
  //   trend: 0,
  //   trend_metric: 0,
  //   trend_metric_unit: "min",
  //   help_text:
  //     "The total frequency of student talk (in minutes) during the class session",
  //   has_alert: false,
  // icon: "comments",
  // canEdit: false
  // });
  // const instructorSpeechSessionMetric = new SessionMetric({
  //   metricType: SessionMetricType.InstructorSpeech,
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
  // icon: "comment",
  // canEdit: false
  // });
  const classPreformanceSessionMetric = new SessionMetric({
    metricType: SessionMetricType.ClassPerformance,
    name: "Class Performance",
    color: {
      dark: "#1E7FD4",
      light: "#1E88E5",
    },
    metric: 0,
    metricPrepend: "",
    hasDenominator: false,
    denominator: 0,
    unit: "%",
    trend: 0,
    trend_metric: 0,
    trend_metric_unit: "%",
    help_text:
      "Did you do any graded activity in this class session? You may enter manually the average class performance and compare them with future sessions!",
    has_alert: false,
    icon: "id-card",
    canEdit: true,
  });
  const attendanceSessionMetric = new SessionMetric({
    metricType: SessionMetricType.Attendance,
    name: "Attendence",
    color: {
      dark: "#842ed1",
      light: "#9534eb",
    },
    metric: Math.round(avgNumberStudents),
    metricPrepend: "~",
    hasDenominator: false,
    denominator: 0,
    unit: "",
    trend: 0,
    trend_metric: 0,
    trend_metric_unit: "",
    help_text: "Average number of students detected during the session",
    has_alert: false,
    icon: "users",
    canEdit: false,
  });
  const metrics: SessionMetric[] = [
    handRaiseSessionMetric,
    // studentSpeechSessionMetric,
    // instructorSpeechSessionMetric,
    classPreformanceSessionMetric,
    attendanceSessionMetric,
  ];

  return (
    <SessionPagePresentational
      session={selectedSession}
      metrics={metrics}
      setSessionName={() => Promise.resolve()}
    />
  );
}
