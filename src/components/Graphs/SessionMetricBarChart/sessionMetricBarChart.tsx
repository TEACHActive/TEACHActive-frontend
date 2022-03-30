import * as React from "react";
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from "recharts";

import { SessionMetricType } from "components/MetricDisplay/metricDisplay.types";
import {
  _useGetArmPoseTotalsInMultipleSessionsQuery,
  _useGetArmPoseTotalsInSecondsSessionQuery,
} from "api/services/armPose";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { SessionGraphType } from "../graphs.types";

import "./sessionMetricBarChart.scss";
import { _useGetAttendanceeStatsInMultipleSessionsQuery as _useGetAttendanceStatsInMultipleSessionsQuery } from "api/services/attendance";
import { Result, Spin } from "antd";

export interface ISessionMetricBarChartProps {
  sessionIds: string[];
  metricType: SessionMetricType | SessionGraphType;
}

export function SessionMetricBarChart(props: ISessionMetricBarChartProps) {
  const {
    data: armPoseData,
    isError: armPoseIsError,
    isFetching: armPoseIsFetching,
    isLoading: armPoseIsLoading,
  } = _useGetArmPoseTotalsInMultipleSessionsQuery(
    props.sessionIds && props.sessionIds.length > 0
      ? props.sessionIds
      : skipToken
  );

  const {
    data: attendanceData,
    isError: attendanceIsError,
    isFetching: attendanceIsFetching,
    isLoading: attendanceIsLoading,
  } = _useGetAttendanceStatsInMultipleSessionsQuery(
    props.sessionIds && props.sessionIds.length > 0
      ? props.sessionIds
      : skipToken
  );

  switch (props.metricType) {
    case SessionMetricType.Attendance:
      return (
        <div>
          <h1>Attendance</h1>
          <BaseMetricProgressGraph
            data={attendanceData}
            loading={attendanceIsFetching || attendanceIsLoading}
            error={attendanceIsError}
            xAxisKey="session.name"
            barKey="data.max"
          />
        </div>
      );
    case SessionMetricType.ClassPerformance:
      return (
        <div>
          <h1>ClassPerformance</h1>
        </div>
      );
    case SessionMetricType.HandRaises:
      return (
        <div>
          <h1>HandRaises</h1>
          <BaseMetricProgressGraph
            data={armPoseData}
            loading={armPoseIsFetching || armPoseIsLoading}
            error={armPoseIsError}
            xAxisKey="session.name"
            barKey="data.handsRaised"
          />
        </div>
      );

    case SessionMetricType.InstructorSpeech:
      return (
        <div>
          <h1>InstructorSpeech</h1>
        </div>
      );
    case SessionMetricType.StudentSpeech:
      return (
        <div>
          <h1>StudentSpeech</h1>
        </div>
      );
    case SessionGraphType.ClassroomDynamics:
      return (
        <div>
          <h1>ClassroomDynamics</h1>
        </div>
      );
    case SessionGraphType.InstructorMovement:
      return (
        <div>
          <h1>InstructorMovement</h1>
        </div>
      );
    case SessionGraphType.SitVStand:
      return (
        <div>
          <h1>SitVStand</h1>
        </div>
      );
  }
}

function BaseMetricProgressGraph(props: {
  data: any[] | null;
  xAxisKey: string;
  barKey: string;
  loading: boolean;
  error: boolean;
}) {
  if (props.loading) return <Spin />;
  if (props.error) return <Result status="error" />;
  return (
    <BarChart width={730} height={250} data={props.data || undefined}>
      <XAxis dataKey={props.xAxisKey} />
      <Tooltip
        content={({ active, payload, label }) => {
          return (
            <div className="custom-tooltip">
              <p className="label">{`${label} : ${
                payload && payload.length > 0 ? payload[0].value : undefined
              }`}</p>
            </div>
          );
        }}
      />
      <YAxis />
      <Legend />
      <Bar dataKey={props.barKey} fill="#8884d8" />
    </BarChart>
  );
}
