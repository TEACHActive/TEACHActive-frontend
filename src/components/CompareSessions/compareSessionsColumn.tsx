import { Typography, Tooltip } from "antd";

import { Session } from "api/services/sessions/types";
import { _useGetArmPoseTotalsInSecondsSessionQuery } from "api/services/armPose";
import { HandRaiseMetricDisplay } from "components/MetricDisplay/Metrics/handRasiseMetricDisplay";
import { AttendanceMetricDisplay } from "components/MetricDisplay/Metrics/attendanceMetricDisplay";
import { InstructorSpeechMetricDisplay } from "components/MetricDisplay/Metrics/instructorSpeechMetricDisplay";
import { PerformanceMetricDisplay } from "components/MetricDisplay/Metrics/performanceMetricDisplay";
import { StudentSpeechMetricDisplay } from "components/MetricDisplay/Metrics/studentSpeechMetricDisplay";

import "./compareSessions.scss";

const { Title } = Typography;

export interface ICompareSessionsColumnProps {
  session: Session;
}

export function CompareSessionsColumn(props: ICompareSessionsColumnProps) {
  return (
    <div className="compareSessionsColumn">
      <Tooltip title={props.session.createdAt.toLocaleString()}>
        <Title level={2}>{props.session.name}</Title>
      </Tooltip>
      <HandRaiseMetricDisplay sessionId={props.session.id} />
      <InstructorSpeechMetricDisplay sessionId={props.session.id} />
      <StudentSpeechMetricDisplay sessionId={props.session.id} />
      <PerformanceMetricDisplay sessionId={props.session.id} />
      <AttendanceMetricDisplay sessionId={props.session.id} />
    </div>
  );
}
