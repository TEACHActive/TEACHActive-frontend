import { Typography, Tooltip } from "antd";

import { Session } from "api/services/sessions/types";
import { SessionGraphType } from "components/Graphs/graphs.types";
import { SessionMetricType } from "components/MetricDisplay/metricDisplay.types";
import { _useGetArmPoseTotalsInSecondsSessionQuery } from "api/services/armPose";
import { HandRaiseMetricDisplay } from "components/MetricDisplay/Metrics/handRasiseMetricDisplay";
import { AttendanceMetricDisplay } from "components/MetricDisplay/Metrics/attendanceMetricDisplay";
import { InstructorSpeechMetricDisplay } from "components/MetricDisplay/Metrics/instructorSpeechMetricDisplay";
import { PerformanceMetricDisplay } from "components/MetricDisplay/Metrics/performanceMetricDisplay";
import { StudentSpeechMetricDisplay } from "components/MetricDisplay/Metrics/studentSpeechMetricDisplay";

import "./compareSessions.scss";
import { ClassroomDynamicsInfoCard } from "components/InfoCard/InfoCards/ClassroomDynamicsInfoCard";
import { InstructorMovementInfoCard } from "components/InfoCard/InfoCards/InstructorMovementInfoCard";
import { SitVStandInfoCard } from "components/InfoCard/InfoCards/sitVStandInfoCard";

const { Title } = Typography;

export interface ICompareSessionsColumnProps {
  session: Session;
  viewMetricsOptions: (SessionMetricType | SessionGraphType)[];
}

export function CompareSessionsColumn(props: ICompareSessionsColumnProps) {
  return (
    <div className="compareSessionsColumn">
      <Tooltip title={props.session.createdAt.toLocaleString()}>
        <Title level={2}>{props.session.name}</Title>
      </Tooltip>

      {props.viewMetricsOptions.includes(SessionMetricType.HandRaises) && (
        <HandRaiseMetricDisplay sessionId={props.session.id} />
      )}
      {props.viewMetricsOptions.includes(
        SessionMetricType.InstructorSpeech
      ) && <InstructorSpeechMetricDisplay sessionId={props.session.id} />}
      {props.viewMetricsOptions.includes(SessionMetricType.StudentSpeech) && (
        <StudentSpeechMetricDisplay sessionId={props.session.id} />
      )}
      {props.viewMetricsOptions.includes(
        SessionMetricType.ClassPerformance
      ) && <PerformanceMetricDisplay sessionId={props.session.id} />}
      {props.viewMetricsOptions.includes(SessionMetricType.Attendance) && (
        <AttendanceMetricDisplay sessionId={props.session.id} />
      )}

      {props.viewMetricsOptions.includes(
        SessionGraphType.InstructorMovement
      ) && <InstructorMovementInfoCard sessionId={props.session?.id} />}
      {props.viewMetricsOptions.includes(
        SessionGraphType.ClassroomDynamics
      ) && <ClassroomDynamicsInfoCard sessionId={props.session?.id} />}
      {props.viewMetricsOptions.includes(SessionGraphType.SitVStand) && (
        <SitVStandInfoCard sessionId={props.session?.id} />
      )}
    </div>
  );
}
