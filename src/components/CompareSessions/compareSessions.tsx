import React from "react";
import { Checkbox } from "antd";

import { Session } from "api/services/sessions/types";
import { CompareSessionsColumn } from "./compareSessionsColumn";
import { SessionGraphType } from "components/Graphs/graphs.types";
import { SessionMetricType } from "components/MetricDisplay/metricDisplay.types";

import "./compareSessions.scss";
import { SessionMetricBarChart } from "components/Graphs/SessionMetricBarChart/sessionMetricBarChart";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
export interface ICompareSessionsProps {
  sessions: Session[];
}

const filterOptions = [
  { label: "Hand Raises", value: SessionMetricType.HandRaises },
  { label: "Instructor Speech", value: SessionMetricType.InstructorSpeech },
  { label: "Student Speech", value: SessionMetricType.StudentSpeech },
  { label: "Class Performance", value: SessionMetricType.ClassPerformance },
  { label: "Attendance", value: SessionMetricType.Attendance },
  { label: "Instructor Movement", value: SessionGraphType.InstructorMovement },
  { label: "Classroom Dynamics", value: SessionGraphType.ClassroomDynamics },
  { label: "Sit v. Stand", value: SessionGraphType.SitVStand },
];

export function CompareSessions(props: ICompareSessionsProps) {
  const [selectedFilters, setSelectedFilters] = React.useState<
    (SessionMetricType | SessionGraphType)[]
  >([SessionMetricType.HandRaises]);
  const [displayColumns, setDisplayColumns] = React.useState<boolean>(false);

  const onChange = (checkedValues: any) => {
    setSelectedFilters(checkedValues);
  };

  console.log(props.sessions);

  return (
    <div>
      <Checkbox
        checked={displayColumns}
        onChange={(e: CheckboxChangeEvent) => {
          setDisplayColumns(e.target.checked);
        }}
      >
        Display Columns
      </Checkbox>
      <br />
      <Checkbox.Group
        options={filterOptions}
        defaultValue={[SessionMetricType.HandRaises]}
        onChange={onChange}
      />

      <hr />

      {props.sessions.length > 0 && (
        <>
          {selectedFilters.includes(SessionMetricType.HandRaises) && (
            <SessionMetricBarChart
              sessionIds={props.sessions.map((session) => session.id)}
              metricType={SessionMetricType.HandRaises}
            />
          )}

          {selectedFilters.includes(SessionMetricType.InstructorSpeech) && (
            <SessionMetricBarChart
              sessionIds={props.sessions.map((session) => session.id)}
              metricType={SessionMetricType.InstructorSpeech}
            />
          )}

          {selectedFilters.includes(SessionMetricType.StudentSpeech) && (
            <SessionMetricBarChart
              sessionIds={props.sessions.map((session) => session.id)}
              metricType={SessionMetricType.StudentSpeech}
            />
          )}

          {selectedFilters.includes(SessionMetricType.ClassPerformance) && (
            <SessionMetricBarChart
              sessionIds={props.sessions.map((session) => session.id)}
              metricType={SessionMetricType.ClassPerformance}
            />
          )}

          {selectedFilters.includes(SessionMetricType.Attendance) && (
            <SessionMetricBarChart
              sessionIds={props.sessions.map((session) => session.id)}
              metricType={SessionMetricType.Attendance}
            />
          )}
        </>
      )}

      {displayColumns && (
        <div className="compareSessionsColumns">
          {props.sessions.map((session, i) => (
            <CompareSessionsColumn
              session={session}
              viewMetricsOptions={selectedFilters}
              key={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
