import * as React from "react";
import { useSelector } from "react-redux";
import { Result, Button, Spin } from "antd";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import { selectSelectedSession } from "redux/sessionSlice";
import { _useGetInstructorFoundPercentageInSessionQuery } from "api/services/movement";

export interface IDetectInvalidSessionProps {}

export function DetectInvalidSession(props: IDetectInvalidSessionProps) {
  const [isDismissed, setIsDismissed] = React.useState(false);
  const selectedSession = useSelector(selectSelectedSession);
  const {
    isLoading,
    isError,
    isFetching,
    data,
  } = _useGetInstructorFoundPercentageInSessionQuery(
    { sessionId: selectedSession?.id || "" },
    selectedSession ? null : skipToken
  );

  if (isLoading || isFetching) return <Spin />;

  if (!data) return <span></span>;

  // 5%
  const minThresholdForInvalidSessionDetectedFramesInstructor = 0.05;
  if (
    data < minThresholdForInvalidSessionDetectedFramesInstructor &&
    !isDismissed
  )
    return (
      <Result
        status="warning"
        title={`Potentally invalid session, only found instructor in ~${(
          (data + Number.EPSILON) *
          100
        ).toFixed(2)}% of analized class time`}
        extra={
          <>
            <Button type="primary">Remove Session?</Button>
            <Button type="text" onClick={() => setIsDismissed(true)}>
              Dismiss
            </Button>
          </>
        }
      />
    );

  return <span></span>;
}
