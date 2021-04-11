import * as React from "react";
import { Empty, Spin } from "antd";
import { useSelector } from "react-redux";

import { SessionPagePresentational } from "./metricPagePresentational";

import "./metricPage.css";
import {
  BaseSession,
  VideoFrame,
  Person,
  VideoFrameSession,
} from "../../api/types";
import apiHandler from "../../api/handler";
import { SessionMetric, SessionMetricType } from "./metricPage.types";
import { getSelectedSession, getSessions } from "../../redux/selectors";
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
    (state: any) => getSelectedSession(state),
    BaseSession.equal
  );
  const sessions: BaseSession[] = useSelector((state: any) =>
    getSessions(state)
  );
  const [loading, setLoading] = React.useState(true);
  const [totalArmPoseFrames, setTotalArmPoseFrames] = React.useState(
    InitArmPoseObj
  );
  const [avgNumberStudents, setAvgNumberStudents] = React.useState(0);
  const [videoFrames, setVideoFrames] = React.useState<{
    instructor: VideoFrameSession[];
    student: VideoFrameSession[];
  }>();
  const [
    sessionPreformanceMetric,
    setSessionPreformanceMetric,
  ] = React.useState<number>(0);

  const [prevFrameResults, setPrevFrameResults] = React.useState<any>();

  React.useEffect(() => {
    getAndAnalyzeFrames(selectedSession);
  }, [selectedSession]);

  const getAndAnalyzeFrames = async (selectedSession: BaseSession) => {
    setLoading(true);
    if (selectedSession) {
      setSessionPreformanceMetric(selectedSession.performance * 100);

      const sortedSessions: BaseSession[] = sessions.sort(
        (a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()
      );
      const currSessionIndex = sortedSessions.findIndex(
        (session) => session.id === selectedSession.id
      );
      const prevSession =
        currSessionIndex > 0 ? sortedSessions[currSessionIndex - 1] : null;

      // if (prevSession) console.log(selectedSession.id, prevSession.id);

      let prevFrames = null;
      if (prevSession) {
        prevFrames = await getFrames(prevSession);
      }
      const frames = await getFrames(selectedSession);
      setVideoFrames(frames);
      const framesResults = await analyzeFrames(frames);
      // console.log(54321, framesResults);

      setTotalArmPoseFrames(framesResults.studentArmPoseFrames);
      setAvgNumberStudents(framesResults.avgNumStudentsDetected);
      if (prevFrames) {
        const prevFrameResults = await analyzeFrames(prevFrames);
        setPrevFrameResults({
          ...prevFrameResults,
          performance: prevSession?.performance,
        });
        // console.log(12345, prevFrameResults);
      }
    }
    setLoading(false);
  };

  const getFrames = async (
    selectedSession: BaseSession
  ): Promise<{
    instructor: VideoFrameSession[];
    student: VideoFrameSession[];
  }> => {
    const studentFrames = apiHandler.getFramesBySessionID(
      selectedSession.id,
      "student"
    );
    const instructorFrames = apiHandler.getFramesBySessionID(
      selectedSession.id,
      "instructor"
    );

    const results = await Promise.all([studentFrames, instructorFrames]);
    return {
      student: results[0],
      instructor: results[1],
    };
  };

  const analyzeFrames = async (frames: {
    instructor: VideoFrameSession[];
    student: VideoFrameSession[];
  }): Promise<{
    studentArmPoseFrames: any;
    avgNumStudentsDetected: number;
  }> => {
    // results[0][0].videoFrames.forEach((frame: VideoFrame) => {
    //   frame.people.forEach((person: Person) => {
    //     if (person.armpose === "handRaised") console.log(person.armpose);
    //   });
    // });
    const videoFrames = frames.student[0].videoFrames;
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

    // setTotalArmPoseFrames(studentArmPoseFrames);

    const avgNumStudentsDetected = videoFrames.reduce(
      (acc: number, frame: VideoFrame, i: number, arr: VideoFrame[]) => {
        return acc + frame.people.length / arr.length;
      },
      0
    );

    // setAvgNumberStudents(avgNumStudentsDetected);

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

    // console.log(peopleHandRaiseTracker);

    return {
      studentArmPoseFrames: studentArmPoseFrames,
      avgNumStudentsDetected: avgNumStudentsDetected,
    };
  };

  function getDefaultObjectAt(array: any[], index: number) {
    return (array[index] = array[index] || {});
  }

  if (!selectedSession) return <Empty />;

  if (loading) return <Spin />;

  const handRaiseDiff = prevFrameResults
    ? totalArmPoseFrames.handRaised -
      prevFrameResults.studentArmPoseFrames.handRaised
    : totalArmPoseFrames.handRaised;
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
    trend: handRaiseDiff > 0 ? 0 : 1,
    trend_metric: handRaiseDiff,
    trend_metric_unit: "",
    help_text:
      "The total frequency of detected hand raises during the class session",
    has_alert: false,
    icon: "hand-paper",
    canEdit: false,
    updateMetric: async (metricUpdateObject: object) => {
      const success = await apiHandler.updateMetric(
        selectedSession.id,
        "handRaise",
        metricUpdateObject
      );
      return success;
    },
    constructMetricUpdateObject: (newMetric: string) => {
      return { handRaise: newMetric };
    },
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
  // canEdit: false,
  // updateMetric: (metricUpdateObject: object) => {
  //   return apiHandler.updateMetric(selectedSession.id, "handRaise", metricUpdateObject);
  // },
  // constructMetricUpdateObject: (newMetric: string) => { return {handRaises: newMetric} }
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
  // canEdit: false,
  // updateMetric: (metricUpdateObject: object) => {
  //   return apiHandler.updateMetric(selectedSession.id, "handRaise", metricUpdateObject);
  // },
  // constructMetricUpdateObject: (newMetric: string) => { return {handRaises: newMetric} }
  // });

  const classPreformanceDiff = prevFrameResults
    ? sessionPreformanceMetric - prevFrameResults.performance
    : sessionPreformanceMetric;
  const classPreformanceSessionMetric = new SessionMetric({
    metricType: SessionMetricType.ClassPerformance,
    name: "Class Performance",
    color: {
      dark: "#1E7FD4",
      light: "#1E88E5",
    },
    metric: sessionPreformanceMetric,
    metricPrepend: "",
    hasDenominator: false,
    denominator: 0,
    unit: "%",
    trend: classPreformanceDiff > 0 ? 0 : 1,
    trend_metric: classPreformanceDiff,
    trend_metric_unit: "%",
    help_text:
      "Did you do any graded activity in this class session? You may enter manually the average class performance and compare them with future sessions!",
    has_alert: false,
    icon: "id-card",
    canEdit: true,
    updateMetric: (metricUpdateObject: { performance: number }) => {
      const result = apiHandler.updateMetric(
        selectedSession.id,
        "performance",
        metricUpdateObject
      );

      setSessionPreformanceMetric(metricUpdateObject.performance * 100);
      return result;
    },
    constructMetricUpdateObject: (newMetric: string) => {
      return { performance: parseFloat(newMetric) / 100.0 };
    },
  });

  const attendanceDiff = prevFrameResults
    ? Math.round(avgNumberStudents) -
      Math.round(prevFrameResults.avgNumStudentsDetected)
    : Math.round(avgNumberStudents);
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
    trend: attendanceDiff > 0 ? 0 : 1,
    trend_metric: attendanceDiff,
    trend_metric_unit: "",
    help_text: "Average number of students detected during the session",
    has_alert: false,
    icon: "users",
    canEdit: false,
    updateMetric: (metricUpdateObject: object) => {
      const result = apiHandler.updateMetric(
        selectedSession.id,
        "attendance",
        metricUpdateObject
      );

      return result;
    },
    constructMetricUpdateObject: (newMetric: string) => {
      return { attendance: newMetric };
    },
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
      videoFrames={videoFrames}
    />
  );
}
