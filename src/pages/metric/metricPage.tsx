import * as React from "react";
import { useSelector } from "react-redux";
import { Empty, message, Spin } from "antd";

import {
  BaseSession,
  Person,
  VideoFrameSession,
  ArmPose,
} from "../../api/types";
import apiHandler from "../../api/handler";
import { MetricPagePresentational } from "./metricPagePresentational";
import { SessionMetric, SessionMetricType } from "./metricPage.types";
import { getSelectedSession, getSessions } from "../../redux/selectors";

import "./metricPage.css";

export interface IMetricPageProps {}

const InitArmPoseObj = {
  handsOnFace: 0,
  handsRaised: 0,
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
  const [loading, setLoading] = React.useState(false);
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

  const [totaledArmPoses, setTotaledArmPoses] = React.useState<
    typeof InitArmPoseObj
  >(InitArmPoseObj);

  const [engagementData, setEngagementData] = React.useState<
    {
      frameNumber: number;
      timestamp: number;
      armPoseCount: {
        handsRaised: {
          pose: ArmPose;
          id: number;
        }[];
        armsCrossed: number;
        error: number;
        handsOnFace: number;
        other: number;
      };
      people: Person[];
    }[]
  >();

  const [prevSession, setPrevSession] = React.useState<BaseSession>();

  React.useEffect(() => {
    if (prevSession?.id !== selectedSession.id) setLoading(true);

    getAndAnalyzeFrames(selectedSession);
    setLoading(false);
    setPrevSession(selectedSession);
  }, [selectedSession]);

  const getAndAnalyzeFrames = async (selectedSession: BaseSession) => {
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

      let prevFrames = null;
      if (prevSession) {
        prevFrames = await getFrames(prevSession);
      }
      const frames = await getFrames(selectedSession);
      console.log(23, frames);
      if (frames.instructor.length === 0 || frames.student.length === 0) {
        message.error("No frames");
        return;
      }

      setVideoFrames(frames);
      const framesResults = await analyzeFrames(frames);

      setAvgNumberStudents(framesResults.avgNumStudentsDetected);

      setEngagementData(framesResults.engagementData);
      setTotaledArmPoses(framesResults.totaledArmPoses);
      if (prevFrames) {
        const prevFrameResults = await analyzeFrames(prevFrames);
        setPrevFrameResults({
          ...prevFrameResults,
          performance: prevSession?.performance,
        });
      }
    }
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
  }) => {
    const studentVideoFrames = frames.student[0].getArmPoseCount();

    const avgNumStudentsDetected = studentVideoFrames.reduce(
      (acc: number, frame, i, arr) => {
        //return acc + frame.people.length / arr.length;//This does avg, we actually want max, rename things later
        return Math.max(acc, frame.people.length);
      },
      0
    );

    const numberOfConcecutiveFramesToBeHandsRaised = 10;
    const numberOfConcecutiveFramesToBeHandDown = 10;
    type peopleArmPoseTracker = {
      concecutiveFramesHandsRaised: number;
      concecutiveFramesHandDown: number;
      numberHandRaises: number;
      //Could also track length of each hand raise
    };

    const initialDateTime = frames.student[0].videoFrames[0].timestamp;

    const engagementData = frames.student[0].getArmPoseCount();

    // studentVideoFrames.reduce(
    //   (peopleHandsRaiseTracker: peopleArmPoseTracker, currentFrame) => {
    //     currentFrame.people.reduce((accumulator, person: Person) => {
    //       return {};
    //     }, {});

    //     return {
    //       concecutiveFramesHandsRaised: 0,
    //       concecutiveFramesHandDown: 0,
    //       numberHandRaises: 0,
    //     };
    //   },
    //   {
    //     concecutiveFramesHandsRaised: 0,
    //     concecutiveFramesHandDown: 0,
    //     numberHandRaises: 0,
    //   }
    // );

    const totaledArmPoses = engagementData.reduce(
      (acc, curVal) => {
        return {
          handsRaised: acc.handsRaised +=
            curVal.armPoseCount.handsRaised.length,
          armsCrossed: acc.armsCrossed += curVal.armPoseCount.armsCrossed,
          error: acc.error += curVal.armPoseCount.error,
          handsOnFace: acc.handsOnFace += curVal.armPoseCount.handsOnFace,
          other: acc.other += curVal.armPoseCount.other,
        };
      },
      {
        handsRaised: 0,
        armsCrossed: 0,
        error: 0,
        handsOnFace: 0,
        other: 0,
      }
    );

    return {
      totaledArmPoses: totaledArmPoses,
      engagementData: engagementData,
      avgNumStudentsDetected: avgNumStudentsDetected,
    };
  };

  if (!selectedSession) return <Empty />;

  if (loading) return <Spin />;

  const handsRaiseDiff = prevFrameResults
    ? totaledArmPoses.handsRaised - prevFrameResults.studentArmPoseFrames
      ? prevFrameResults.studentArmPoseFrames.handsRaised
      : 0
    : totaledArmPoses.handsRaised;
  const handRaiseSessionMetric = new SessionMetric({
    metricType: SessionMetricType.HandRaises,
    name: "Hand Raises",
    color: {
      dark: "#E6AE05",
      light: "#FFC107",
    },
    metric: Math.round(totaledArmPoses.handsRaised / 15.0),
    metricPrepend: "",
    hasDenominator: false,
    denominator: 0,
    unit: "sec",
    trend: handsRaiseDiff > 0 ? 0 : 1,
    trend_metric: Math.round(handsRaiseDiff / 15.0),
    trend_metric_unit: "sec",
    help_text:
      "The total number of seconds hand raises were detected during the class session",
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
    children:
      sessionPreformanceMetric === 0 ? (
        <span>Enter your class preformance</span>
      ) : (
        <></>
      ),
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
    <MetricPagePresentational
      session={selectedSession}
      metrics={metrics}
      setSessionName={() => Promise.resolve()} //Todo
      videoFrames={videoFrames}
      engagementData={engagementData}
    />
  );
}
