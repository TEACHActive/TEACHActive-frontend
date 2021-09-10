import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Empty, message, Spin } from "antd";

import { getSelectedSession, getSessions } from "redux/selectors";
import { MetricPagePresentational } from "./metricPagePresentational";
import { SessionMetric, SessionMetricType } from "./metricPage.types";
import { BaseSession, StudentAttendenceStats } from "api/types";

import "./metricPage.css";
import apiHandler from "api/handler";
import { setSelectedSession, updateSessions } from "redux/actions";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import { useCallback } from "react";
import { Cookie } from "constants/cookies";
import { CookieSingleton } from "types/cookies.types";
import { RootState } from "redux/store";

import * as ReducerActionType from "../../redux/actionTypes";

export interface IMetricPageProps {}

export default function MetricPage(props: IMetricPageProps) {
  const dispatch = useDispatch();

  const selectedSession: BaseSession | null = useSelector(
    (state: RootState) => getSelectedSession(state),
    BaseSession.equal
  );

  const sessions: BaseSession[] = useSelector((state: RootState) =>
    getSessions(state)
  );

  const [loadingMetrics, setLoadingMetrics] = React.useState(false);
  const [metrics, setMetrics] = React.useState<SessionMetric[]>([]);

  // const [avgNumberStudents, setAvgNumberStudents] = React.useState(0);
  // const [videoFrames, setVideoFrames] = React.useState<{
  //   instructor: VideoFrameSession[];
  //   student: VideoFrameSession[];
  // }>();
  // const [
  //   sessionPreformanceMetric,
  //   setSessionPreformanceMetric,
  // ] = React.useState<number>(0);

  // const [prevFrameResults, setPrevFrameResults] = React.useState<any>();

  // const [totaledArmPoses, setTotaledArmPoses] = React.useState<
  //   typeof InitArmPoseObj
  // >(InitArmPoseObj);

  // const [prevSession, setPrevSession] = React.useState<BaseSession>();

  const setSessionName = async (
    sessionId: string,
    newSessionName: string,
    uid: string
  ) => {
    await apiHandler.updateSessionName(sessionId, newSessionName);
    dispatch(updateSessions(uid));
  };

  const createMetrics = useCallback(
    async (sessionId: string) => {
      setLoadingMetrics(true);
      let metrics: SessionMetric[] = [];
      const sortedSessions = sessions.sort(
        (a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()
      );
      let previousSession;

      const indexOfSelectedSession = sortedSessions.findIndex(
        (session) => session.id === sessionId
      );
      if (indexOfSelectedSession === -1) {
        //Something went wrong, should have found the session
        // message.error("Error occured when sorting sessions");
        dispatch(setSelectedSession(null));
        return;
      }
      if (indexOfSelectedSession !== 0) {
        previousSession = sortedSessions[indexOfSelectedSession - 1];
      }

      //=====ArmPose=====
      const armPoseStats = await apiHandler.getNumberOfFramesOfArmPosesInSession(
        sessionId
      );
      let prevArmPoseStats;
      if (previousSession) {
        prevArmPoseStats = await apiHandler.getNumberOfFramesOfArmPosesInSession(
          previousSession.id
        );
      }
      if (armPoseStats) {
        const handsRaiseDiff = prevArmPoseStats
          ? armPoseStats.handsRaised - prevArmPoseStats.handsRaised
          : 0;
        metrics.push({
          metricType: SessionMetricType.HandRaises,
          name: "Hand Raises",
          color: {
            dark: "#E6AE05",
            light: "#FFC107",
          },
          metric: Math.round(armPoseStats.handsRaised / 15.0), //Todo: get fps per video
          metricPrepend: "",
          hasDenominator: false,
          denominator: 0,
          unit: "sec",
          trend: previousSession ? handsRaiseDiff : undefined,
          trend_metric: previousSession
            ? Math.round(handsRaiseDiff / 15.0)
            : undefined,
          trend_metric_unit: previousSession ? "sec" : undefined,
          help_text:
            "The total number of seconds hand raises were detected during the class session",
          has_alert: false,
          icon: "hand-paper",
          canEdit: false,
          updateMetric: async (newMetric: string) => {
            // const success = await apiHandler.updateMetric(//Todo
            //   sessionId,
            //   "handRaise",
            //   newMetric
            // );
            return Promise.resolve(false);
          },
        });
      }

      //=====Class Preformance=====
      const classPreformanceDiff = previousSession
        ? selectedSession.performance - previousSession.performance
        : 0;

      metrics.push({
        metricType: SessionMetricType.ClassPerformance,
        name: "Class Performance",
        color: {
          dark: "#1E7FD4",
          light: "#1E88E5",
        },
        metric: selectedSession.performance,
        metricPrepend: "",
        hasDenominator: false,
        denominator: 0,
        unit: "%",
        trend: previousSession ? classPreformanceDiff : undefined,
        trend_metric: previousSession ? classPreformanceDiff : undefined,
        trend_metric_unit: previousSession ? "%" : undefined,
        help_text:
          "Did you do any graded activity in this class session? You may enter manually the average class performance and compare them with future sessions!",
        has_alert: false,
        icon: "id-card",
        canEdit: true,
        updateMetric: async (newMetric: string) => {
          const result = await apiHandler.updateSessionPerformance(
            sessionId,
            parseFloat(newMetric)
          );
          if (!result) {
            //Failed to update
            return false;
          }
          //Todo: refresh sessions here
          return true;
        },
        children: !selectedSession.performance ? (
          <span>Enter your class preformance</span>
        ) : (
          <></>
        ),
      });

      //=====Attendance=====
      const studentAttendanceStats = await apiHandler.getStudentAttendenceStatsInSession(
        sessionId
      );

      let prevStudentAttendanceStats: StudentAttendenceStats | null = null;
      if (previousSession) {
        prevStudentAttendanceStats = await apiHandler.getStudentAttendenceStatsInSession(
          previousSession.id
        );
      }

      let attendanceDiff = 0;
      if (studentAttendanceStats) {
        attendanceDiff = previousSession
          ? Math.round(
              studentAttendanceStats.max -
                (prevStudentAttendanceStats?.max || 0)
            )
          : 0;
      }

      metrics.push({
        metricType: SessionMetricType.Attendance,
        name: "Attendence",
        color: {
          dark: "#842ed1",
          light: "#9534eb",
        },
        metric: studentAttendanceStats
          ? Math.round(studentAttendanceStats.max)
          : 0,
        metricPrepend: "~",
        hasDenominator: false,
        denominator: 0,
        unit: "",
        trend: previousSession ? attendanceDiff : undefined,
        trend_metric: previousSession ? attendanceDiff : undefined,
        trend_metric_unit: previousSession ? "" : undefined,
        help_text: "Average number of students detected during the session",
        has_alert: false,
        icon: "users",
        canEdit: false,
        updateMetric: (newMetric: string) => {
          // const result = apiHandler.updateMetric(
          //   sessionId,
          //   "attendance",
          //   metricUpdateObject
          // );

          return Promise.resolve(false);
        },
      });

      setMetrics(metrics);
      dispatch({ type: ReducerActionType.UPDATE_METRICS, payload: metrics})
      setLoadingMetrics(false);
    },
    [selectedSession, sessions]
  );

  React.useEffect(() => {
    if (!selectedSession) return;
    console.log("reloading metrics page with sessionID " + selectedSession.id);

    createMetrics(selectedSession.id);
  }, [createMetrics, selectedSession]);

  if (!selectedSession) return <Empty />;

  // // const studentSpeechSessionMetric = new SessionMetric({
  // //   metricType: SessionMetricType.StudentSpeech,
  // //   name: "Student Speech",
  // //   color: {
  // //     dark: "#CB1859",
  // //     light: "#D81B60",
  // //   },
  // //   metric: 10,
  // // metricPrepend: "",
  // //   hasDenominator: true,
  // //   denominator: 50,
  // //   unit: "min",
  // //   trend: 0,
  // //   trend_metric: 0,
  // //   trend_metric_unit: "min",
  // //   help_text:
  // //     "The total frequency of student talk (in minutes) during the class session",
  // //   has_alert: false,
  // // icon: "comments",
  // // canEdit: false,
  // // updateMetric: (metricUpdateObject: object) => {
  // //   return apiHandler.updateMetric(selectedSession.id, "handRaise", metricUpdateObject);
  // // },
  // // constructMetricUpdateObject: (newMetric: string) => { return {handRaises: newMetric} }
  // // });
  // // const instructorSpeechSessionMetric = new SessionMetric({
  // //   metricType: SessionMetricType.InstructorSpeech,
  // //   name: "Instructor Speech",
  // //   color: {
  // //     dark: "#01332A",
  // //     light: "#004D40",
  // //   },
  // //   metric: 20,
  // //   hasDenominator: true,
  // //   denominator: 50,
  // //   unit: "min",
  // //   trend: 0,
  // //   trend_metric: 0,
  // //   trend_metric_unit: "min",
  // //   help_text:
  // //     "The total frequency of instructor talk (in minutes) during the class session",
  // //   has_alert: false,
  // // icon: "comment",
  // // canEdit: false,
  // // updateMetric: (metricUpdateObject: object) => {
  // //   return apiHandler.updateMetric(selectedSession.id, "handRaise", metricUpdateObject);
  // // },
  // // constructMetricUpdateObject: (newMetric: string) => { return {handRaises: newMetric} }
  // // });

  return (
    <FirebaseAuthConsumer>
      {({
        isSignedIn,
        user,
      }: {
        isSignedIn: boolean;
        user: firebase.default.User;
      }) =>
        isSignedIn ? (
          <MetricPagePresentational
            session={selectedSession}
            metrics={metrics}
            setSessionName={(session: BaseSession, newSessionName: string) =>
              setSessionName(session.id, newSessionName, user.uid)
            }
            loadingMetrics={loadingMetrics}
          />
        ) : (
          <Empty />
        )
      }
    </FirebaseAuthConsumer>
  );
}
